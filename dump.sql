COPY (SELECT id, category, title, body, session_short_text FROM cards ORDER BY category) TO STDOUT WITH CSV HEADER;
