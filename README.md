# IA Capto Acessor Financeiro

Este projeto utiliza a API Gemini do Google para analisar imagens de gráficos financeiros, identificar padrões e fornecer resumos técnicos e recomendações. A aplicação inclui um sistema de assinatura gerenciado pelo Stripe.

## Guia de Implantação (Deploy) na Vercel

Siga estas instruções para implantar o aplicativo em um ambiente de produção como a Vercel.

### Passo 1: Colocar o Código em um Repositório Git

Antes de tudo, seu projeto precisa estar em um repositório no GitHub, GitLab ou Bitbucket. A Vercel usará este repositório para fazer o deploy do seu site.

Se você ainda não fez isso, siga os comandos abaixo no seu terminal, dentro da pasta do projeto:

```bash
# 1. Inicialize um repositório Git
git init

# 2. Adicione todos os seus arquivos
git add .

# 3. Faça o primeiro commit (salve as alterações)
git commit -m "Commit inicial do projeto"

# 4. (Opcional, mas recomendado) Renomeie a branch principal para 'main'
git branch -M main

# 5. Conecte seu repositório local ao repositório remoto que você criou no GitHub
#    (Substitua a URL pelo link do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 6. Envie seu código para o GitHub
git push -u origin main
```

### Passo 2: Importar o Projeto na Vercel

1.  **Crie uma conta na Vercel** e conecte-a à sua conta do GitHub (ou outro provedor Git).
2.  No painel da Vercel, clique em **"Add New... -> Project"**.
3.  Selecione o repositório que você acabou de configurar no Passo 1.
4.  A Vercel irá detectar automaticamente que é um projeto Vite/React e preencher as configurações de build. Você não precisa alterar nada aqui. A Vercel também irá detectar a pasta `api` e configurar o backend automaticamente.
5.  Antes de fazer o deploy, vá para a seção **"Environment Variables" (Variáveis de Ambiente)**.

### Passo 3: Configurar as Variáveis de Ambiente e Fazer o Deploy

Este é o passo mais importante para a segurança e funcionalidade do seu aplicativo. Adicione as seguintes variáveis:

| Chave (Key)               | Valor (Value)                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_KEY`                 | Sua chave de API do **Google Gemini**. Obtenha em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).                                   |
| `STRIPE_SECRET_KEY`       | Sua chave secreta do **Stripe** em modo de **PRODUÇÃO** (`sk_live_...`). Obtenha no [painel do Stripe](https://dashboard.stripe.com/apikeys).                   |
| `WEBAPP_URL`              | A URL principal do seu site. Use o seu domínio final: **`https://www.iacapto.com.br`**.                                                              |
| `STRIPE_WEBHOOK_SECRET`   | **Deixe em branco por enquanto.** Você obterá este valor no Passo 5, após o primeiro deploy.                                                                 |

Com as três primeiras variáveis configuradas, clique em **"Deploy"**. Aguarde a conclusão.

### Passo 4: Configurar o Domínio e DNS

Após o primeiro deploy, seu site estará online em uma URL da Vercel. Agora, vamos apontar seu domínio personalizado para ele.

#### 4.1 Adicionar o Domínio na Vercel
1.  No painel do seu projeto na Vercel, vá para a aba **"Settings" -> "Domains"**.
2.  Digite seu domínio (`iacapto.com.br`) e clique em "Add".
3.  A Vercel provavelmente recomendará o redirecionamento para `www.iacapto.com.br`. Aceite a recomendação.
4.  Você verá uma tela com o erro **"Invalid Configuration"**. Isso é normal. Ela mostrará os registros DNS que você precisa configurar.

#### 4.2 Configurar os Registros no seu Provedor de Domínio
1.  Faça login no site onde você comprou o domínio `iacapto.com.br` (Hostinger, GoDaddy, Registro.br, etc.).
2.  Encontre a seção de **Gerenciamento de DNS**.
3.  Adicione (ou edite) os seguintes registros, conforme solicitado pela Vercel:
    *   **Registro Principal (para `iacapto.com.br`):**
        *   **Tipo:** `A`
        *   **Nome (Host):** `@`
        *   **Valor:** O endereço IP que a Vercel fornecer (Ex: `76.76.21.21`).
        *   **⚠️ ATENÇÃO:** Se o seu provedor de DNS não aceitar o caractere `@` no campo Nome/Host, deixe o campo **em branco**.
    *   **Registro do Subdomínio (para `www.iacapto.com.br`):**
        *   **Tipo:** `CNAME`
        *   **Nome (Host):** `www`
        *   **Valor (ou "Nome do servidor"):** `cname.vercel-dns.com`
4.  **Aguarde a Propagação:** As alterações de DNS podem levar de alguns minutos a algumas horas para serem atualizadas em toda a internet.

#### 4.3 Configurar o Redirecionamento de Domínio
É uma boa prática escolher uma versão do seu domínio (com ou sem `www`) como a principal e redirecionar a outra para ela.
1.  Na tela de **Domínios** da Vercel, clique em **"Editar"** no domínio que **NÃO** será o principal (geralmente `iacapto.com.br`).
2.  Selecione a opção **"Redirecionar para outro domínio"**.
3.  No campo de destino, digite o domínio principal (ex: `www.iacapto.com.br`).
4.  Escolha o tipo **"308 Redirecionamento Permanente"**.
5.  Clique em **"Salvar"**.

### Passo 5: Configurar o Webhook do Stripe para Produção

O webhook permite que o Stripe notifique seu aplicativo quando um pagamento for concluído.

> **⚠️ ATENÇÃO:** Este passo deve ser feito no painel do **Stripe** ([dashboard.stripe.com](https://dashboard.stripe.com)), **NÃO** no painel da Vercel. A Vercel também tem uma seção de webhooks, mas ela serve para um propósito diferente e não deve ser usada aqui.

1.  Vá para o **Stripe Dashboard** (certifique-se de estar em modo de **PRODUÇÃO**).
2.  Navegue até **"Desenvolvedores" -> "Webhooks"**.
3.  Clique em **"+ Adicionar um endpoint"**. Se for perguntado o "Tipo de destino", escolha **"Endpoint de webhook"**.
4.  No campo **"URL do endpoint"**, cole a URL do seu site e adicione `/api/stripe-webhook` no final.
    *   Use seu domínio final: `https://www.iacapto.com.br/api/stripe-webhook`
5.  Clique em **"Selecionar eventos"**. Na tela que aparecer, **IGNORE AS CATEGORIAS SUGERIDAS** e use a **BARRA DE BUSCA** para encontrar e marcar cada um dos seguintes eventos:
    *   `checkout.session.completed`
    *   `customer.subscription.updated`
    *   `customer.subscription.deleted`
6.  Após selecionar os três eventos, clique em **"Adicionar eventos"**.
7.  Na tela final de configuração, o **"Nome do destino"** pode ser deixado como o padrão gerado pelo Stripe, e a **"Descrição"** é opcional. Clique em **"Criar destino"**.
8.  **VERIFICAÇÃO CRÍTICA:** Após criar, confirme na lista de webhooks que o seu novo destino está "Ouvindo" **3 eventos**. Se estiver mostrando apenas 1, clique para editar e adicione os eventos que faltam.

### Passo 6: Adicionar o Segredo do Webhook na Vercel

1.  Na página de detalhes do webhook que você acabou de criar no Stripe, encontre a seção **"Segredo de assinatura"** e clique para **revelar**. Copie o segredo (começa com `whsec_...`).
2.  Volte para o painel do seu projeto na **Vercel**.
3.  Vá para **"Settings" -> "Environment Variables"**.
4.  Adicione a última variável de ambiente:
    *   Chave: `STRIPE_WEBHOOK_SECRET`
    *   Valor: Cole o segredo que você copiou do Stripe.
5.  Salve as alterações.

### Passo 7: Fazer o Redeploy Final

Para que a nova variável do webhook seja aplicada, você precisa fazer o "redeploy" do seu projeto.

1.  Na Vercel, vá para a aba **"Deployments"** do seu projeto.
2.  Encontre o último deploy bem-sucedido.
3.  Clique no menu de três pontos (...) e selecione **"Redeploy"**.

**Pronto!** Seu aplicativo está totalmente configurado e funcionando em produção.