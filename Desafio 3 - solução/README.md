# Solução desafio #3 - Asteroids

Você pode ver o jogo <a href="https://asteroids-codelab-solved.netlify.app/">aqui</a>.

- **Desafio 1:** Foi implementado um HUD acima do jogo, contendo informações sobre score e tempo.
- **Desafio Bônus 1:** O tema do jogo foi mudado. Asteroides foram substituidos por aliens, e o jogador foi substituido por um astronauta
- **Desafio Bônus 2:** Foram implementados facehuggers. Eles andam mais devagar, mas quando chegam perto o suficiente, dão um salto em direção ao jogador.
- **Desafio Bônus 3:** Foi adicionada a habilidade de usar uma sentry gun, que atira automaticamente nos aliens próximos
- **Desafio Bônus 4:** O jogador pode caminhar livremente pelo mapa, porem ele é muito mais lento que seus obstaculos
- **Desafio Bônus 5:** O mouse controla a direção do jogador, e também é usado para atirar.
- **Desafio Supresa:** O misterioso erro de performance era o resultado do jogo não remover os tiros do jogador da lista de objetos moviveis quando eles saiam da tela. Essa lista de objetos acava, eventualmente, ficando grande demais, desperdiçando processamento com objetos que não eram mais visiveis
