# Script de Apresentação: Sistema Tita's (Módulos de Gestão e Autoatendimento)

## 1. Introdução (1 minuto)

**[Ação]**
Deixe a tela inicial do Dashboard (ou a tela de login, se houver) aberta, mas com foco na identidade visual do sistema.

**[Fala]**
"Olá a todos. Hoje vou apresentar a parte do sistema que eu desenvolvi para o **Tita's**. O meu foco principal foi criar uma experiência completa e fluida de ponta a ponta. Isso significa que eu construí desde a interface administrativa, onde o gerente opera o restaurante, até a interface final do cliente, seja ele acessando pelo próprio celular ou usando um tablet fixado na mesa. Tudo foi pensado com um design premium, responsivo e focado na melhor usabilidade possível."

---

## 2. Visão do Gestor: O Painel Administrativo (2 minutos)

**[Ação]**
Navegue pela estrutura principal do layout (menu lateral no desktop, redimensione a janela para mostrar a responsividade e o menu mobile).

**[Fala]**
"Começando pela visão do gestor, desenvolvi todo o layout base do Painel Administrativo. Como vocês podem ver, temos um design moderno e limpo. A navegação foi construída com ícones retráteis que expandem ao passar o mouse, otimizando o espaço da tela. O painel é 100% responsivo: se o gerente estiver usando pelo celular, a barra lateral se transforma em um menu superior com navegação simplificada."

**[Ação]**
Clique no menu **"Cadastros"** e acesse a tela de produtos. Clique no botão **"Novo Produto"** para abrir o modal.

**[Fala]**
"Aqui na tela de Cadastros, construí a gestão do catálogo de produtos. A ideia é que seja uma operação rápida. Ao clicar em 'Novo Produto', abrimos um modal limpo onde podemos inserir o nome, preço e categoria. Tudo é validado e inserido na tabela abaixo, que lista o cardápio atual com o status de cada item, permitindo edições e exclusões diretas."

---

## 3. Experiência do Cliente: Cardápio Mobile/Web (3 minutos)

**[Ação]**
Mude a visualização do navegador para formato Mobile (Inspecionar Elemento > Dispositivo Móvel) e acesse a rota `/cardapio`.

**[Fala]**
"Agora, mudando de lado: como o cliente interage com o nosso sistema? Construí o Cardápio Digital focado na experiência mobile, ideal para quando o cliente escaneia um QR Code na mesa. Notem as animações de transição suaves e o uso do menu inferior (Bottom Nav) que separa o 'Cardápio' da 'Minha Conta'."

**[Ação]**
Navegue pelas categorias, clique em um hambúrguer (ex: Tita's Classic Burger). Brinque com os adicionais.

**[Fala]**
"Ao selecionar um produto, temos um modal imersivo. Se for um lanche, o cliente é obrigado a escolher o ponto da carne e pode turbinar o pedido com adicionais como bacon ou cheddar, que já atualizam o valor total em tempo real na barra inferior. Tudo é muito claro e evita erros de pedido."

**[Ação]**
Adicione ao carrinho, vá para a aba **"Minha Conta"**, clique em **"Enviar para a Cozinha"** e depois em **"Pedir a Conta"**.

**[Fala]**
"Na aba 'Minha Conta', o cliente vê o que está na bandeja (ainda não enviado) e o histórico do que já foi para a cozinha. Ao decidir finalizar, ele clica em 'Pedir a Conta'. Imediatamente a tela bloqueia, informando que o garçom está a caminho, evitando pedidos duplicados no momento do pagamento."

---

## 4. Experiência na Mesa: Tablet (3 minutos)

**[Ação]**
Mude a visualização do navegador para formato Tablet (ex: iPad Mini) e acesse a rota do cardápio do tablet (ex: `/mesa/123/cardapio`).

**[Fala]**
"Para restaurantes que usam Tablets fixos nas mesas, criei uma interface dedicada, aproveitando melhor o espaço da tela. Diferente do mobile, aqui temos uma barra lateral de categorias e uma grade ampla de produtos, além de uma barra de pesquisa rápida no topo."

**[Ação]**
Mostre o topo: Botão "Chamar Garçom", clique no "Carrinho" (abre uma gaveta/sheet lateral). Depois navegue para o botão **"Minha Mesa"** (rota `/mesa/123/minha-mesa`).

**[Fala]**
"Nessa versão, o carrinho abre lateralmente (como uma gaveta), permitindo que o cliente continue vendo o cardápio. Mas o grande diferencial aqui é a tela 'Minha Mesa'. Ela funciona como o extrato do cliente em tempo real. Ele vê o total consumido em destaque e acompanha o status de cada pedido — se foi enviado, se está em produção na cozinha ou se já está pronto."

**[Ação]**
Na tela 'Minha Mesa', clique no botão vermelho **"Pedir a Conta"**. Mostre o modal de confirmação e confirme.

**[Fala]**
"Por fim, quando o cliente deseja ir embora, ele clica em 'Pedir a Conta'. Incluí um modal de confirmação com um aviso de que novos pedidos serão bloqueados. Ao confirmar, a tela inteira entra no modo 'Conta Solicitada', com um design impactante que avisa ao cliente que o garçom já foi chamado, mantendo apenas a opção de chamar o garçom, se necessário."

---

## 5. Encerramento (1 minuto)

**[Ação]**
Volte a tela para a visualização principal ou para o Dashboard.

**[Fala]**
"Em resumo, a minha contribuição para o Tita's focou em unir uma **operação eficiente para o restaurante** com uma **experiência visualmente incrível e autônoma para o cliente**. Utilizei as melhores práticas de UI/UX, animações modernas e um fluxo de estados seguro (carrinho, envio, fechamento de conta) que prepara o restaurante para escalar seu atendimento. Muito obrigado!"

---

### Dicas para a hora da apresentação:
1. **Teste o fluxo antes:** Como o sistema depende de dados da loja (`store`), faça um "caminho feliz" adicionando alguns produtos e mesas no código ou no estado inicial para garantir que as telas não fiquem vazias.
2. **Foque nos detalhes visuais:** Mencione as animações (como o modal que sobe suavemente usando Framer Motion) e os detalhes de feedback visual (como os *toast messages* verdes/vermelhos quando uma ação acontece).
3. **Mantenha um ritmo dinâmico:** Não pare muito tempo lendo código. O foco dessa parte que você criou é 100% **visual e de fluxo de usuário (Front-end)**. Mostre funcionando!
