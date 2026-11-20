# AutoAgenda

Sistema web para pequenas oficinas mecânicas controlarem clientes, veículos, serviços e ordens de serviço.

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac, disciplina Boas Práticas de Desenvolvimento de Software, com o professor Leandro C. Cardoso.

## O problema

Oficina de bairro quase sempre anota o atendimento em caderno e no WhatsApp. Com isso acaba marcando dois carros no mesmo horário, esquecendo um serviço que foi combinado ou perdendo o telefone do cliente na hora de avisar que o carro ficou pronto. O AutoAgenda junta essas informações em um lugar só.

Quem usa é o dono, o atendente ou o mecânico da oficina, então as telas são simples e funcionam também no celular.

## Funcionalidades

São os seis requisitos definidos na primeira etapa do projeto.

| Código | Função | Página | Situação |
| --- | --- | --- | --- |
| RF01 | Cadastrar clientes com nome, telefone e e-mail | `clientes.html` | Pronto |
| RF02 | Cadastrar veículos com placa, marca, modelo e ano, ligados a um cliente | `veiculos.html` | Pronto |
| RF03 | Cadastrar os serviços da oficina com tempo médio e preço | `servicos.html` | Pronto |
| RF04 | Agendar o atendimento informando cliente, veículo, data, horário e serviços | `ordens.html` | Pronto |
| RF05 | Consultar a agenda por dia e impedir o agendamento em horário já ocupado | `ordens.html` e `historico.html` | Pronto |
| RF06 | Alterar, cancelar e mudar a situação do agendamento | `ordens.html` | Pronto |

Todas as telas de cadastro permitem editar, excluir e pesquisar.

Além dos requisitos, o sistema ganhou duas telas a mais: o histórico, que filtra as ordens por cliente, veículo e data, e o orçamento, que monta uma página pronta para imprimir ou salvar em PDF com os serviços e o total da ordem.

A trava de horário do RF05 funciona assim: a oficina atende uma ordem por vez, então ao tentar marcar uma segunda ordem no mesmo dia e horário o sistema recusa e avisa qual horário já está ocupado.

## Como rodar

Não precisa instalar nada e não tem servidor nem banco de dados.

A forma mais rápida é baixar o projeto e abrir o arquivo `index.html` no navegador.

Para testar do jeito mais parecido com um site de verdade, dá para subir um servidor local dentro da pasta do projeto:

```bash
python -m http.server 8000
```

Depois é só abrir `http://localhost:8000` no navegador.

## Onde os dados ficam guardados

Os dados ficam no LocalStorage do navegador, em quatro tabelas: `clientes`, `veiculos`, `servicos` e `ordens`. Cada uma guarda uma lista de registros com um `id` próprio.

Vale lembrar de três coisas ao testar:

- os dados ficam só naquele navegador, naquele computador;
- quem limpar os dados de navegação apaga tudo;
- para começar do zero, abra o console do navegador com F12 e rode `localStorage.clear()`.

## Estrutura dos arquivos

```
index.html          página inicial
clientes.html       RF01
veiculos.html       RF02
servicos.html       RF03
ordens.html         RF04, RF05 e RF06
historico.html      consulta da agenda por dia
orcamento.html      orcamento para impressao
css/
  estilo.css        estilo de todas as páginas
js/
  armazenamento.js  ler, salvar e buscar no LocalStorage
  utilidades.js     mensagens, criação de células e botões, formatação de data e dinheiro
  clientes.js       uma página, um arquivo
  veiculos.js
  servicos.js
  ordens.js
  historico.js
  orcamento.js
```

Os arquivos `armazenamento.js` e `utilidades.js` são usados por todas as páginas e entram antes do arquivo da página no HTML.

## Padrões que combinamos seguir

São as boas práticas que apresentamos na primeira etapa:

- nomes de variáveis e funções em português e por extenso, como `mostrarClientes` e `campoTelefone`;
- cada função faz uma coisa só;
- cada página tem o seu arquivo em `js/`, com o mesmo nome do HTML;
- função que serve para mais de uma página vai para `js/utilidades.js` em vez de ser copiada;
- todo o CSS fica em `css/estilo.css`, sem estilo solto dentro do HTML;
- ao montar a tela pelo JavaScript, usar `textContent` e não `innerHTML`, para o que o usuário digita nunca virar código;
- mensagem de commit explicando o que mudou, por exemplo `feat: cadastro de serviços` ou `fix: corrige total da ordem`;
- antes de juntar na `main`, outro integrante revisa.

Quem for criar uma página nova pode usar `clientes.html` e `js/clientes.js` como modelo, porque eles têm o formato completo de cadastrar, editar, excluir e pesquisar.

## Como contribuir

Trabalhamos com uma branch por tarefa e pull request para a `main`.

```bash
git clone https://github.com/senac-ads-grupo-34/AutoAgenda.git
cd AutoAgenda
git checkout -b feat/servicos
```

Depois de alterar os arquivos:

```bash
git add .
git commit -m "feat: cadastro de serviços"
git push -u origin feat/servicos
```

Com a branch no GitHub, abra o pull request para a `main` e chame alguém do grupo para revisar.

## Integrantes e divisão do trabalho

| Integrante | Responsabilidade |
| --- | --- |
| João Antonio Pereira Lemos Machado | Coordenação, documentação, serviços e trava de horário |
| Ana Flavia Ortiz de Paula | Persona e protótipo das telas |
| Guilherme de Faria Martins da Silva | Revisão dos pull requests |
| Lucas Sulzbach Rilho | Estrutura base, clientes e veículos (RF01 e RF02) |
| Mateus Oliveira Macedo | Criação do repositório e revisão dos serviços (RF03) |
| Pedro Henrique de Freitas Menezes | Ordens de serviço, histórico e orçamento |
| Vitor Yuri da Silva | CSS, adaptação para celular e testes |

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem framework e sem biblioteca externa. Os dados ficam no LocalStorage do navegador. Usamos Git e GitHub para versionar e o Visual Studio Code para editar.
