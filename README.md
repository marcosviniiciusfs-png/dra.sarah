# Melhor em Cintas — landing page

Página estática em HTML, CSS e JavaScript. Abra `index.html` para uma revisão local ou sirva esta pasta com qualquer servidor HTTP. Para Cloudflare Pages ou GitHub Pages, publique `index.html`, `css`, `js` e `assets`, sem etapa de compilação. O diretório `dist` é uma cópia pronta para publicação no Sites.

## Antes de vender

- Em `js/main.js`, preencha `CONFIG.whatsapp` com DDI e DDD, e `CONFIG.checkout` se houver checkout externo. Sem configuração, os botões mostram um aviso em vez de enviar pedidos a um contato fictício.
- Coloque as fotos originais autorizadas em `assets/img/perfil.webp`, `frente.webp` e `tres-quartos.webp`. Elas substituirão automaticamente a ilustração provisória. As imagens anexadas ao chat não estavam disponíveis no sistema de arquivos. Não há fotos reais incluídas nesta entrega.
- Atualize preços, parcelamento, disponibilidade e frete nas duas ofertas em `index.html`.
- Substitua as medidas P/M/G e o método de medição por dados oficiais do fabricante.
- Insira depoimentos autorizados, fotos de clientes, nota média e quantidade real de clientes. Nenhum testemunho, nota ou resultado foi inventado. Os três slides atuais são espaços editoriais claramente identificados.
- Preencha razão social, CNPJ, contato e os links `instagram`, `policy` e `privacy`. Revise as condições de troca.
- Valide os detalhes técnicos, composição, costuras, cuidados de lavagem e tamanhos com o fabricante. Não foram declaradas costuras planas sem confirmação.
- Configure `metaPixelId` e `googleTagId` e integre consentimento antes de chamar `enableMarketingTracking()`. Clique de compra registra intenção, nunca venda concluída. Não enviamos o tipo de cirurgia aos rastreadores.
- Atualize domínio, imagem Open Graph e schema com as informações comerciais verdadeiras. Ofertas e notas não foram incluídas no schema sem dados.

## Movimento e acessibilidade

GSAP e ScrollTrigger via CDN. Dobras suaves em eixos alternados e sequência tipo sanfona; seção de ângulos pinada no desktop, seleção manual em todos os tamanhos. As rotações foram limitadas para manter a leitura, em vez de virar o texto em 90 graus. Mobile usa movimentos menores e dispensa pins. `prefers-reduced-motion` usa apenas fades breves e rolagem nativa. Se a CDN não carregar, conteúdo e controles continuam acessíveis.

Sem frameworks, fontes com `display=swap`, dimensões de imagens explícitas, lazy loading abaixo da primeira dobra, links de salto, foco visível e perguntas em elementos `details` nativos.

Não há pontuação Lighthouse certificada. Validar novamente performance e visual após inserir as fotos reais e as integrações comerciais.


Atualizacao: imagens fotograficas geradas com IA a partir das referencias do usuario, em tres angulos. Dobras nas fotos em tres faixas e transicoes suaves nas secoes, com versao simplificada para movimento reduzido.

Atualizacao: fotos sem animacao de entrada; galeria sem pin, zoom ou troca ligada ao scroll; passos sem sanfona; textos sobre a primeira foto removidos.
