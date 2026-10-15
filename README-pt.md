# App oficial Prazeres Interrompidos (PWA)

Uma aplicação web instalável, feita para funcionar sem subscrições ou serviços pagos. A app é uma porta de entrada para as páginas oficiais: não duplica textos, capas ou listas do site.

## Como funciona quando o site muda

Os cartões abrem as páginas existentes em `prazeresinterrompidos.pt`. Quando uma página é alterada no site, os visitantes passam a ver a versão atual assim que a abrem. A cópia guardada no telemóvel é apenas o ecrã inicial, o menu e os ícones da app; esses elementos só mudam quando se publica uma nova versão da própria app.

O modo sem ligação guarda apenas a estrutura da app. As páginas do site, a rádio e os conteúdos online precisam de ligação à internet.

## Publicar gratuitamente com GitHub Pages

1. Cria um repositório público dedicado, por exemplo `app-prazeres-interrompidos`.
2. Carrega para a raiz do repositório todos os ficheiros e a pasta `assets` deste projeto.
3. No repositório, abre **Settings → Pages** e escolhe **Deploy from a branch**, branch `main`, pasta `/(root)`.
4. Aguarda a publicação e abre o endereço `https://prazeres-interrompidos.github.io/app-prazeres-interrompidos/`.
5. No telemóvel, abre esse endereço no Safari (iPhone) ou Chrome (Android), escolhe **Adicionar ao ecrã principal** / **Instalar app**.

Se escolheres outro nome de repositório ou outro utilizador GitHub, o URL muda. Os caminhos dos ficheiros são relativos, por isso a app funciona na raiz de GitHub Pages e também numa pasta de projeto.

## Alterar os destinos

Os endereços das páginas estão diretamente nos elementos `<a>` do `index.html`. Para adicionar, retirar ou corrigir um destino, altera esse ficheiro e publica os novos ficheiros no mesmo repositório.

## Testar localmente

É necessário servir os ficheiros por HTTP (o Service Worker não funciona abrindo o HTML diretamente como `file://`). Por exemplo:

```bash
python3 -m http.server 8000
```

Depois abre `http://localhost:8000/app-prazeres-interrompidos/`.
