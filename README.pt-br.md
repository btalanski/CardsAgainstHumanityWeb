# Cards Against Humanity Web App
Hospede seu próprio jogo de Cartas contra a Humanidade.

*Leia em outras línguas: [English](https://github.com/btalanski/CartasContraAHumanidadeWeb/blob/master/README.md).*

## Sobre
Esse projeto é apenas um estudo de como implementar um jogo multiplayer utilizando Socket.io e Node.js. React foi usando para a contrução da interface do cliente. Esse é uma implementação bem simples de uma estrutura cliente/servidor e a lógica do jogo. Esse software não deve ser utilizado em um servidor de produção. Nenhum tipo de suporte será oferecido para correção de bugs. O código está sendo disponibilizado na integra neste repositório. Sinta-se a vontade para clonar e fazer suas próprias modificações.

## To-dos:
Essa é uma lista de coisas que eu *gostaria* de implementar, mas estão fora do escopo do projeto:

#### Frontend
- [ ] Usar Redux para gerenciar o estado
- [ ] Melhorar o código dos componentes
- [ ] Melhorar o design da interface
- [ ] Implementar suporte para seleção de múltiplas cartas
- [ ] Implementar componente de chat
- [ ] Melhorar tratamento de erros

#### Backend
- [ ] Melhorar o código do servidor (refatoração)
- [ ] Melhorar o código do jogo (refatoração)

## Iniciando

Confira abaixo os passos para executar o projeto de forma local para desenvolvimento e teste.

### Requisitos mínimos
```
Node.js v10+ (LTS recomendado)
```

### Instalando

* Clone esse repositório
* Execute `npm install` no diretório raiz.

### Executando a aplicação
Execute o comando a seguir para iniciar o servidor:
```
npm start
```

Execute o comando a seguir para iniciar o webpack dev server:
```
npm run build
```

Acesse a aplicação através do endereço `http://localhost:8080` our `http://localhost:9001` para dev server

## Running the tests

Nenhum teste implementado.

## Deployment

Você pode hospedar a aplicação de forma gratuita usando o free tier do Google Cloud para jogar com amigos.

**Deploy no Google Cloud**

* Crie um projeto no Google Cloud
* Instale o `gcloud` SDK em seu computador
* Siga os comando abaixo:

Listar seus projetos com `gcloud`:
```
gcloud projects list
```
Configure o projeto que você criou no Google Cloud em sua máquina:
```
gcloud config set project `PROJECT_ID`
```
Realize o deploy usando o comando:
```
gcloud app deploy
```
## Tecnologias utilizadas:

* [Socket.IO](https://socket.io)
* [Node.js](https://nodejs.org)
* [React](https://reactjs.org)
* [Webpack](https://webpack.js.org)

## Contribuindo
N/A

## Versionamento

N/A

## Autores

* **Bruno Talanski** - *Initial work* - [Github](https://github.com/btalanski)

See also the list of [contributors](https://github.com/btalanski/CartasContraAHumanidadeWeb/) who participated in this project.

## Licença

Esse projeto é distribuido utilizando a licença MIT, veja  o arquivo [LICENSE.md](LICENSE.md) para mais detalhes.

## Informações
O conteúdo de Cards Against Humanity é disponibilizado através da licença Creative Commons.
