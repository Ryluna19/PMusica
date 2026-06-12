🎵 Music Playlist Manager

Aplicação web para cadastrar, gerenciar e reproduzir músicas em uma playlist.

Projeto desenvolvido com Node.js, Express, EJS, MongoDB Atlas e Mongoose, com foco em praticar rotas, renderização server-side, integração com banco de dados e operações CRUD.




📌 Sobre o projeto

O Music Playlist Manager é uma aplicação web para gerenciamento de músicas em uma playlist.

Através da área administrativa, é possível cadastrar músicas informando nome, artista, imagem de capa e link da música. As músicas cadastradas são salvas em um banco MongoDB Atlas e exibidas na página principal da aplicação.

Este projeto foi originalmente desenvolvido como estudo e está sendo atualizado para melhorar organização, documentação, conexão com banco de dados, estrutura do código e apresentação visual.

🚀 Funcionalidades
Cadastro de músicas
Listagem de músicas cadastradas
Edição de músicas
Remoção de músicas
Área administrativa para gerenciamento
Página principal com playlist
Integração com MongoDB Atlas
Renderização de páginas com EJS
Uso de variáveis de ambiente com .env
🛠️ Tecnologias utilizadas
HTML5
CSS3
JavaScript
Node.js
Express
EJS
MongoDB Atlas
Mongoose
Dotenv
Nodemon
Git e GitHub
⚙️ Como executar o projeto
1. Clone o repositório
git clone https://github.com/Ryluna19/PMusica.git
2. Acesse a pasta do projeto
cd PMusica
3. Instale as dependências
npm install
4. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto com base no arquivo .env.example.

Exemplo:

DB_URI=sua_string_de_conexao_mongodb
PORT=3000
5. Execute o projeto
npm run dev

ou:

npm start

A aplicação ficará disponível em:

http://localhost:3000

Área administrativa:

http://localhost:3000/admin
📁 Estrutura básica
PMusica/
├── database/
│   └── db.js
├── model/
│   └── Music.js
├── public/
├── views/
├── index.js
├── package.json
├── .env.example
└── README.md
🧠 Aprendizados

Durante o desenvolvimento e atualização deste projeto, foram praticados conceitos como:

Criação de servidor com Express
Organização de rotas
Renderização server-side com EJS
Conexão com MongoDB Atlas
Modelagem de dados com Mongoose
Operações CRUD
Uso de variáveis de ambiente
Organização e documentação de projeto
🔄 Status do projeto

Projeto em processo de atualização.

Próximas melhorias planejadas:

Melhorar o layout da página principal
Atualizar o visual da área administrativa
Melhorar responsividade
Adicionar feedback visual para ações do usuário
Melhorar validações de formulário
Organizar melhor as rotas do projeto
🔐 Observação sobre variáveis de ambiente

O arquivo .env não deve ser enviado para o GitHub, pois contém dados sensíveis como a string de conexão com o banco de dados.

Por isso, o projeto utiliza um arquivo .env.example como modelo de configuração.

👨‍💻 Autor

Ryan Santos

GitHub: github.com/Ryluna19
LinkedIn: linkedin.com/in/ryan-bulhoes-santos-560b25225
📄 Licença

Este projeto está sob a licença MIT.