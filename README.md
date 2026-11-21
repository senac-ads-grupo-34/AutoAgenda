# AutoAgenda

Sistema web para pequenas oficinas mecânicas controlarem clientes, veículos, serviços e ordens de serviço.

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac, disciplina Boas Práticas de Desenvolvimento de Software, com o professor Leandro C. Cardoso.

## O problema

Oficina de bairro quase sempre anota o atendimento em caderno e no WhatsApp. Com isso acaba marcando dois carros no mesmo horário, esquecendo um serviço que foi combinado ou perdendo o telefone do cliente na hora de avisar que o carro ficou pronto. O AutoAgenda junta essas informações em um lugar só.

Quem usa é o dono, o atendente ou o mecânico da oficina, então as telas são simples e funcionam também no celular.

## Funcionalidades

| Código | Função | Página | Situação |
| --- | --- | --- | --- |
| RF01 | Cadastrar clientes com nome, telefone e e-mail | `clientes.html` | Pronto |
| RF02 | Cadastrar veículos com placa, marca, modelo e ano, ligados a um cliente | `veiculos.html` | Pronto |
| RF03 | Cadastrar os serviços da oficina com tempo médio e preço | `servicos.html` | Em desenvolvimento |
| RF04 | Abrir ordens de serviço com cliente, veículo, data, situação e lista de serviços | `ordens.html` | Pronto |
| RF05 | Consultar o histórico de ordens por cliente ou por veículo | `historico.html` | Pronto |
| RF06 | Ver e imprimir o orçamento de uma ordem | `orcamento.html` | Pronto |

Todas as telas de cadastro permitem editar, excluir e pesquisar.

Enquanto o RF03 não fica pronto, a tela de ordens abre normalmente, mas não tem serviço nenhum para escolher e o total da ordem fica zerado.

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
ordens.html         RF04
historico.html      RF05
orcamento.html      RF06
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
| João Antonio Pereira Lemos Machado | Coordenação, documentação e cronograma |
| Ana Flavia Ortiz de Paula | Persona e protótipo das telas |
| Guilherme de Faria Martins da Silva | Revisão dos pull requests |
| Lucas Sulzbach Rilho | Estrutura base, clientes e veículos (RF01 e RF02) |
| Mateus Oliveira Macedo | Criação do repositório e serviços (RF03) |
| Pedro Henrique de Freitas Menezes | Ordens de serviço, histórico e orçamento (RF04 a RF06) |
| Vitor Yuri da Silva | CSS, adaptação para celular e testes |

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem framework e sem biblioteca externa. Os dados ficam no LocalStorage do navegador. Usamos Git e GitHub para versionar e o Visual Studio Code para editar.
