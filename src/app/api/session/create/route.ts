import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SessionMode, SessionLength, CardIntensity, SessionFocus } from "@prisma/client";
import { generateSessionSequence } from "@/lib/deriva/session-engine";

export async function POST(req: Request) {
  try {
    const userSession = await getSession();
    if (!userSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mode, length, maxIntensity, musicEnabled, preferencesJson, deckId, videosEnabled, sessionFocus, categoryBias } = body;

    let deck;
    if (deckId) {
      deck = await prisma.deck.findUnique({ where: { id: deckId } });
      if (!deck) return NextResponse.json({ error: "Deck não encontrado" }, { status: 404 });

      if (deck.requires_couple_unlock && deck.unlock_group_key) {
        const unlock = await prisma.coupleUnlock.findUnique({
          where: {
            user_id_unlock_group_key: {
              user_id: userSession.userId,
              unlock_group_key: deck.unlock_group_key
            }
          }
        });
        if (!unlock || !unlock.is_enabled) {
          return NextResponse.json({ error: "Deck bloqueado. Desbloqueie nas configurações." }, { status: 403 });
        }
      }
    } else {
      deck = await prisma.deck.findFirst({
        where: { is_default: true, type: 'SYSTEM' }
      });
      if (!deck) return NextResponse.json({ error: "Nenhum deck padrão encontrado" }, { status: 500 });
    }

    let targetCardCount = 10;
    if (length === "CURTA") targetCardCount = 6;
    if (length === "COMPLETA") targetCardCount = 14;

    let temperature = 1.0;
    let actualCategoryBias = categoryBias;
    let actualSessionFocus = sessionFocus || "FOR_HER";
    let disableDarkPenalty = false;

    if (mode === "FAISCA") {
      targetCardCount = 1;
      temperature = 2.0;
    } else if (mode === "MERGULHO") {
      targetCardCount = length === "CURTA" ? 4 : 5;
      temperature = 0.6;
    } else if (mode === "NOITE_DELA") {
      actualSessionFocus = "FOR_HER";
      temperature = 1.0;
    } else if (mode === "FOCO_CATEGORIA") {
      temperature = 0.7;
    } else if (mode === "TONS_ESCUROS") {
      temperature = 0.5;
      actualCategoryBias = "PRETO";
      disableDarkPenalty = true;
    }

    let parsedPrefs = {};
    try { if (preferencesJson) parsedPrefs = JSON.parse(preferencesJson); } catch {}
    const finalPrefsJson = JSON.stringify({ ...parsedPrefs, temperature, categoryBias: actualCategoryBias, disableDarkPenalty });

    const session = await prisma.session.create({
      data: {
        user_id: userSession.userId,
        deck_id: deck.id,
        mode: mode as SessionMode,
        length: length as SessionLength,
        status: "ACTIVE",
        max_intensity: maxIntensity as CardIntensity,
        videos_enabled: videosEnabled ?? true,
        music_enabled: musicEnabled,
        target_card_count: targetCardCount,
        current_position: 0,
        session_focus: actualSessionFocus as SessionFocus,
        preferences_json: finalPrefsJson
      }
    });

    // Generate sequence
    const sequence = await generateSessionSequence({
      userId: userSession.userId,
      sessionId: session.id,
      deckId: deck.id,
      mode: session.mode,
      length: session.length,
      maxIntensity: session.max_intensity,
      videosEnabled: session.videos_enabled,
      targetCardCount: session.target_card_count,
      sessionFocus: session.session_focus,
      preferencesJson: session.preferences_json,
      temperature,
      categoryBias: actualCategoryBias,
      disableDarkPenalty,
      currentPosition: 0,
      shownCardIds: []
    });

    if (!sequence || sequence.length === 0) {
      console.warn("[Session Create] Nenhuma carta retornada pela engine para os filtros atuais.");
      // Soft-delete the empty session
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return NextResponse.json({ error: "Não há cartas suficientes para este modo. Tente afrouxar os filtros ou escolha outro modo." }, { status: 400 });
    }

    // Create session cards with QUEUED status (except first one which is SHOWN)
    await prisma.sessionCard.createMany({
      data: sequence.map((seq, index) => ({
        session_id: session.id,
        card_id: seq.card_id,
        position: seq.position,
        status: index === 0 ? "SHOWN" : "QUEUED",
        metadata_json: seq.metadata_json,
      }))
    });

    await prisma.session.update({
      where: { id: session.id },
      data: { last_card_id: sequence[0].card_id }
    });
    
    // Trigger voice preload asynchronously (don't await)
    import("@/services/server/voiceService").then(({ preloadSessionAudios }) => {
      preloadSessionAudios(session.id).catch(err => console.error("[Preload] error:", err));
    }).catch(err => console.error("[Preload Import] error:", err));

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    console.error("[Session Create Error]:", error);

    const err = error as any;
    // Identificar erro de constraint (P2003 = foreign key falhou, ex: usuário inválido)
    if (err?.code === 'P2003') {
      return NextResponse.json({ error: "Usuário inválido ou sessão expirada. Por favor, faça login novamente." }, { status: 401 });
    }
    
    // Identificar erro de coluna faltando (P2022) - caso alguma migration ainda falhe
    if (err?.code === 'P2022') {
      return NextResponse.json({ error: "Erro de sincronização no banco de dados. Contate o suporte." }, { status: 500 });
    }

    return NextResponse.json({ error: "Não foi possível iniciar a sessão agora. Tente novamente." }, { status: 500 });
  }
}
