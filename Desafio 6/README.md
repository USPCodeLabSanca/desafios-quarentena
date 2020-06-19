# Desafio #6 - Chat Bot

## Atenção

Este projeto não é mais uma página web. Ele é um projeto em Node.js. Para executar esse projeto, é preciso ter instalado o Node.

Para instalar o Node no windows, veja esse [link](https://nodejs.org/en/download/), e baixe qualquer uma das versões (LTS ou current).

Pra instalar o Node em alguma distro de Linux, veja esse [link](https://nodejs.org/en/download/package-manager/).

Para verificar se o Node.js já está instalado, execute esse comando em qualquer terminal: `node -v`. Se o Node.js estiver corretamente instalado, a sua versão atual deve ser impressa.

Ao instalar o Node.js, normalmente outro programa chamado npm (node package manager) é também automaticamente instalado. Para verificar se o npm foi corretamente instalado, execute esse comando em qualquer terminal: `npm -v`. Assim como o Node, deve ser impressa a versão do npm.


## Executando esse projeto

Primeiro, é preciso cadastrar um Bot no Telegram. Para fazer isso, você precisa falar com o BotFather ([@BotFather](https://t.me/botfather)) pelo Telegram:

<img src="https://i.imgur.com/HYylpoj.png">

Ao iniciar a conversa com esse bot, execute o comando `/newbot`. Após providenciar um nome e um arroba, você receberá um token de acesso, que será essencial para iniciar esse projeto.

Feitos esses passos, você deve ir no arquivo `index.js` desse projeto. Na linha 7, há a seguinte expressão:
```javascript
const token = 'YOUR ACCESS TOKEN HERE';
```

Você deve trocar essa string pelo token de acesso que você recebeu do @BotFather.

Feito isso, execute os seguintes comandos num terminal, dentro da pasta desse projeto:

- `npm install` - Instala as depências do projeto. Pode demorar um pouco. Precisa de internet.
- `npm start` - Inicia o projeto.

Com o projeto rodando, encontre o seu bot no Telegram (pelo username dele) e mande uma mensagem.

Não se esqueça que toda vez que você fizer alguma mudança no projeto, você precisa reiniciar o processo para essa mudança fazer efeito (matar o processo com um `CTRL + C`, e iniciar de novo com `npm install`). Se isso te incomodar de mais, dê uma olhada nessa ferramenta: [nodemon](https://www.npmjs.com/package/nodemon)

Note que esse projeto usa uma biblioteca chamada `node-telegram-bot-api`. Mais informações sobre ela, você pode encontrar [aqui](https://www.npmjs.com/package/node-telegram-bot-api)

## Desafios

- **Desafio 1:** Sempre que o usuário digitar `/help`, o bot deve imprimir todos os possiveis comandos que o usuário pode dar. Um comando que já está implementado, por exemplo, é o `/jokempo`
- **Desafio Bônus 1:** Isole o Token de acesso do seu bot num arquivo separado, que não será enviado para o git. Não se esqueça que o git é, em geral, público, e enviar coisas importantes como chaves de acesso é um erro comum. Crie um arquivo qualquer (por exemplo, `token.js`), que só exporta a chave, e adicione o arquivo no `.gitignore`
- **Desafio Bônus 2:** Faça ele responder à frases ou palavras específicas que você quiser. Alguns simples exemplos é ele responder à "Que dia é hoje?", ou "Quem é o seu criador?", etc...
- **Desafio Bônus 3:** Crie outro jogo! Já tem o jogo jokempo implementado, mas você pode criar o seu. O jogo não precisa ser complicado, e pode ser acionado da forma que você desejar. Alguns exemplos de jogo são `par ou impar` (parecido com jokempo), `adivinhe o número` (você tem que adivinhar o número que o bot está "pensando"), `quick maths` (Você tem que rapidamente fazer as contas que o bot te der), etc...
- **Desafio Bônus 4:** Não se esqueça de deixar comentários no seu código! Isso é de bastante ajuda pra gente da correção, e pra você do futuro.

Materiais de apoio sobre HTML, CSS e JS:
  - <a href = 'https://ucl-sanca.xyz/Web-Development-Studies'>Material JS treinamento Semcomp</a>
  - <a href = 'https://ucl-sanca.xyz/aulas-codelab'> Aulas do Codeleb 2019.2 </a>
## Entrega
Zipe seus arquivos e envie no <a href = 'https://forms.gle/bwBewBA57Zodug5z8'> Form </a>. Caso tenha mais de 10mb, coloque-o público em seu drive pessoal e nos envie o link!.

Aprenda sobre <a href = 'https://www.youtube.com/watch?v=r9Kauz9B4i8'>git (material de apoio)</a>, desenvolva seu projeto em seu repositório e nos envie o link dele no formulário!

