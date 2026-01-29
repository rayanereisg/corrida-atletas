#!/usr/bin/env bash
set -euo pipefail

RANGE=${1:-HEAD~20..HEAD}

# list commits in range
COMMITS=$(git rev-list $RANGE || true)
if [ -z "$COMMITS" ]; then
  echo "No commits found in range: $RANGE"
  exit 0
fi

# Keywords/accent checks for Portuguese
PORT_KEYWORDS='ã|á|é|í|ó|ú|ç|ão|ões|adicionar|adiciona|adicionando|adicionado|corrigir|corrigido|atualizar|atualizado|refatorar|refatorado|melhorar|remover|teste|testes|estilos|valida|validar|versão|tempo|salvar'

for SHA in $COMMITS; do
  MSG=$(git log --format=%B -n 1 $SHA | sed -e 's/\r//g' | sed -n '1p')
  HEADLINE=$(echo "$MSG" | head -n1)

  # conventional commit format check
  if ! echo "$HEADLINE" | grep -E -q '^(feat|fix|docs|style|refactor|test|chore|perf)(\(.+\))?: .+'; then
    echo "ERROR: Commit $SHA não segue o formato 'tipo: descrição' (conventional commits)." >&2
    echo "Mensagem: $HEADLINE" >&2
    exit 1
  fi

  # description in Portuguese (heurística)
  DESC=$(echo "$HEADLINE" | sed -E 's/^[^:]+:[[:space:]]*//')
  if ! echo "$DESC" | grep -Ei -q "$PORT_KEYWORDS"; then
    echo "ERROR: Commit $SHA parece não estar em português ou não contém palavras-chave esperadas." >&2
    echo "Mensagem: $HEADLINE" >&2
    exit 1
  fi

done

echo "OK: Todas as mensagens de commit no intervalo $RANGE parecem estar em português e seguem o formato."