# Regras do Projeto

Para este projeto, você deve seguir rigorosamente as regras definidas nos seguintes documentos:

## 1. Roteador de Decisões
[ROTEADOR DE DECIÇÕES.txt](file:///Users/marcosfelipe/Library/CloudStorage/GoogleDrive-felipebretas03@gmail.com/Meu%20Drive/Backup%202026/Sites/titas/ROTEADOR%20DE%20DECI%C3%87%C3%95ES.txt)
- **Instruções Importantes:** Siga as Regras Gerais descritas no início do arquivo (como ativar a skill Caveman em todos os prompts, escolhas de skills, etc).
- **Catálogo de Skills:** Devido ao tamanho enorme do arquivo (9MB), não tente lê-lo inteiro de uma vez. Quando precisar utilizar ou consultar uma skill, utilize a ferramenta `grep_search` para buscar o nome da skill dentro do arquivo.

## 2. Claude Rules
[CLAUDE_RULES.rtf](file:///Users/marcosfelipe/Library/CloudStorage/GoogleDrive-felipebretas03@gmail.com/Meu%20Drive/Backup%202026/Sites/titas/CLAUDE_RULES.rtf)
- **Instruções Importantes:** Este documento contém 17 regras obrigatórias de desenvolvimento que devem ser aplicadas em todas as tarefas.
- **Resumo das Regras:**
  - **Código e Arquitetura:** Comentários e nomes em português (quando aplicável); priorizar código limpo, pequeno, sem duplicações, reaproveitável e seguindo a arquitetura atual.
  - **Performance e Segurança:** Otimizar para a Vercel (bundle, imagens, cache, SSR/SSG/ISR). Nunca expor *secrets* ou tokens no frontend.
  - **Git e UX:** Não quebrar ou remover funcionalidades sem pedir. Focar em interfaces responsivas, acessíveis e com bom feedback visual (loading/error).
  - **Boas Práticas de Trabalho:** Nunca criar código desnecessário, logs no final (remover console.logs) ou assumir decisões importantes sem autorização. Antes de codar, planeje. Antes de entregar, verifique Typescript, ESLint, imports, responsividade, etc.

## 3. Fluxo de Git Rigoroso
- Execute `git status` e `git fetch origin`.
- Verifique se a branch está atualizada e **nunca descarte alterações locais**.
- **Nunca** utilize `git reset --hard` sem autorização.
- **Nunca** utilize `git push --force`.
- **Nunca** faça commit ou push diretamente na `main`.
- **Trabalhe sempre em uma feature branch.**
- Antes do commit: executar lint, executar testes e verificar git diff.
- Gere commits objetivos e descritivos.
- Faça push **somente da branch atual**.
