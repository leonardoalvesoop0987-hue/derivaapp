#!/bin/bash
psql "postgresql://deriva_user:DerivaPwa%40123@localhost:5432/deriva_pwa" -f /var/www/deriva-pwa/update_short_texts.sql
