# Igma challenge API 🇧🇷

<div align="center">
  <img  style="border-radius: 8px;" src="assets/igma.png" width="90%"/>
  <br/>
  <br/>
  <a href="https://igma-challenge-production.up.railway.app" target=”_blank”><strong>Link do Deploy »</strong></a>
  <br/>
  <br/>
</div>
<div align="center">
  <a href="#about">Sobre</a> •
  <a href="#features">Características</a> •
  <a href="#technologies">Tecnologias</a> •
  <a href="#technologies">Versão Disponível</a> •
  <a href="#technologies">Ambiente</a> •
  <a href="#run">Como Rodar?</a>
</div>

## <span id="about">🌐 Sobre o Projeto</span>

Este projeto é uma API para cadastro e busca de clientes construída usando [Nest.js](https://nestjs.com/). Durante o processo de cadastro de novos clientes, ocorre uma validação de CPF, para verificar se o CPF fornecido é valido.

A API é desenvolvida com Nest.js (que faz uso do Node.js) como roteador, sua utilização se deve ao fato de permitir a criação de aplicações escaláveis e de fácil manutenção.

Para realizar a comunicação com o banco de banco de dados foi utlizado o PrismaORM, devido à sua facilidade de integração com o Nest.js, além de automatizar o processo de criação, seed, e troca de banco de dados.

O banco de dados utilizado foi o PostgreSQL

O projeto segue uma estrutura moderna para manter a base de código organizada e de fácil manutenção.

---

## <span id="features">Características</span>

- Utilização do Nest.js para construção do servidor
- PrismaORM para criação do banco de dados
- Configuração do ambiente de desenvolvimento para criação da API
- Implementando PostgresSQL como banco de dados para a API
- Jest e Supertest para realizar os testes unitários e e2e, garantindo a qualidade da API.
- Faker para geração de dados falsos e aleatórios.
- Docker para tornar fácil o uso da API independente do ambiente em que se encontra (sistema operacional ou sofftwares instalados).
- Design patterns e architecture patterns.
- Orientação à objetos
- Erros customizados

</br>

## <span id="technologies">🛠 Tecnologias</span>

Abaixo seguem as ferramentas e frameworks utilizados no projeto: <br/>

<div style="display: inline_block"> 
  <img alt="Gui-Nest" height="30" src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
  <img alt="Gui-Jest" height="30" src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white">
  <img alt="Gui-Prisma" height="30" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
  <img alt="Gui-PostgresSQL" height="30" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white">
  <img alt="Gui-Docker" height="30" src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white">
  <img alt="Gui-Ts" height="30" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
</div>

</br>

## <span id="live-version">🚀 Versão Disponível</span>

Você pode verificar a documentação e realizar testes na API visitando a versão live hospedada em [igma-challenge-production.up.railway.appl](https://igma-challenge-production.up.railway.appl).

</br>

## <span id="enviroment">🌱 Variáveis de ambiente</span>

Este projeto usa uma variável de ambiente quando executado fora do ambiente docker, verifique o arquivo .env.example para ver o exemplo.

---

## <span id="run">⚙️ Como Rodar</span>

1. Clone este repositório
2. Garanta que o [Docker](https://www.docker.com/) esteja instalado e funcional na sua máquina
3. Construa os contâineres docker para o servidor e para o banco de dados

```bash
docker compose up

# Caso seja necessário de privilégios de super usuário
sudo docker compose up
```

Quando a aplicação estiver pronta, será exibido algo como

```bash
LOG:  database system is ready to accept connections
```

4. Abra um novo terminal na mesma pasta e entre no servidor

```bash
docker compose exec app bash
```

5. Verifique se o banco de dados está atualizado

```bash
npx prisma generate

npm run migration:run
```

6. Para rodar o projeto em desenvolvimento basta executar

```bash
npm run start:dev
```

7. Para executar a versão de produção

```bash
npm run start:prod
```

8. Por último, acesse no seu navegador ou faça uma requisição para http://localhost:3000/customers para acessar a aplicação

### 🧪 Testes

Para rodar os testes execute o comando (se estiver utilizando docker, entre no servidor antes)

```bash
# testes unitários
$ npm run test

# testes e2e
$ npm run test:e2e

# cobertura dos testes
$ npm run test:cov
```
