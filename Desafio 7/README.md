# Desafio 7 - Chat em grupo

<img src="https://i.imgur.com/hlBNnwk.png" style="border: 1px solid black">

Esse projeto é um grupo de chat. Qualquer pessoa que abrir esta página poderá mandar mensagens, que todas as outras pessoas poderão ver.

# Pré-requisitos

Este projeto não é mais só uma página web. Ele contem também um projeto em Node.js. Para executar esse projeto, é preciso ter instalado o Node.

Para instalar o Node no windows, veja esse [link](https://nodejs.org/en/download/), e baixe qualquer uma das versões (LTS ou current).

Pra instalar o Node em alguma distro de Linux, veja esse [link](https://nodejs.org/en/download/package-manager/).

Para verificar se o Node.js já está instalado, execute esse comando em qualquer terminal: `node -v`. Se o Node.js estiver corretamente instalado, a sua versão atual deve ser impressa.

Ao instalar o Node.js, normalmente outro programa chamado npm (node package manager) é também automaticamente instalado. Para verificar se o npm foi corretamente instalado, execute esse comando em qualquer terminal: `npm -v`. Assim como o Node, deve ser impressa a versão do npm.

# Executando o projeto

O projeto é composto por duas partes: o Front-end, e o Back-end. Para saber mais sobre a diferença entre os dois, veja esse [link](https://blog.udacity.com/2014/12/front-end-vs-back-end-vs-full-stack-web-developers.html).

## Front-end

O Front-end pode ser inicializado normalmente, apenas abrindo o arquivo `index.html` num browser qualquer.

Uma dica: Para simular duas pessoas usando o seu chat, use o modo anônimo do seu browser

## Back-end

Já para o Back-end, é preciso utilizar o Node.js. Caso você não tenha o Node instalado, veja a sessão `Pré-requisitos` acima.

Primeiro, é preciso baixar as dependências. Abra um terminal situado na pasta `Back-end`, e execute o seguinte comando:

```
npm install
```

Isso só deverá ser feito uma vez após o projeto ter sido baixado.

Em seguida, para iniciar o projeto, execute o seguinte comando num terminal:

```
node index.js
```

E pronto! Se tudo deu certo, você deveria ver a seguinte mensagem: `Ready! Server listening on port 8080`. Se você tiver alguma dúvida, ou der algo de errado, busque algum dos coordenadores do Codelab, que estaremos dispostos e felizem em ajudar :)

Não se esqueça que toda vez que você fizer alguma mudança no projeto, você precisa reiniciar o processo para essa mudança fazer efeito (matar o processo com um `CTRL + C`, e iniciar de novo com `npm install`). Se isso te incomodar de mais, dê uma olhada nessa ferramenta: [nodemon](https://www.npmjs.com/package/nodemon)

## Desafios

- **Desafio 1:** Da forma como o projeto está, cada usuário tem nome e cor atribuidos aleatóriamente, e salvos no `localStorage` (veja a linha 35 do `index.js` do Front-end). Crie um botão que permita o usuário trocar esse nome e essa cor, seja gerando uma combinação aleatória de novo, ou perguntando como o usuário gostaria de se identificar.
- **Desafio Bônus 1:** Adicione uma forma do usuário ver o horário (e talvez até a data) em que cada mensagem foi enviada.
- **Desafio Bônus 3:** Da forma como está, o back-end, quando reiniciado, perder todas as mensagens que já foram enviadas. Crie alguma forma de salvar essas mensagens num arquivo, e ler desse arquivo toda vez que ele for inicializado. [aqui](https://tutorialedge.net/nodejs/reading-writing-files-with-nodejs/) tem um bom tutorial de manipulação de arquivos. Você pode usar algum banco de dados se quiser, mas não precisa.
- **Desafio Bônus 2:** Impossibilite dois usuários de terem o mesmo nome e a mesma cor (uma boa forma de fazer isso é criar um [dicionário](https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs) no back-end com todos os nomes que já existem, e ao invés do front-end se auto-atribuir um nome aleatório, ele pede pro back-end algum nome disponível).
- **Desafio Bônus 4:** Não se esqueça de deixar comentários no seu código! Isso é de bastante ajuda pra gente da correção, e pra você do futuro.

Materiais de apoio sobre HTML, CSS e JS:
  - <a href = 'https://ucl-sanca.xyz/Web-Development-Studies'>Material JS treinamento Semcomp</a>
  - <a href = 'https://ucl-sanca.xyz/aulas-codelab'> Aulas do Codeleb 2019.2 </a>
## Entrega
Zipe seus arquivos e envie no <a href = 'https://forms.gle/SeKetjHEeEY3Dw4q6'> Form </a>. Caso tenha mais de 10mb, coloque-o público em seu drive pessoal e nos envie o link!.

Aprenda sobre <a href = 'https://www.youtube.com/watch?v=r9Kauz9B4i8'>git (material de apoio)</a>, desenvolva seu projeto em seu repositório e nos envie o link dele no formulário!
