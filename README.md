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

### Passo 2: Importar e Implantar o Projeto na Vercel

1.  **Crie uma conta na Vercel** e conecte-a à sua conta do GitHub (ou outro provedor Git).
2.  No painel da Vercel, clique em **"Add New... -> Project"**.
3.  Selecione o repositório que você acabou de configurar no Passo 1.
4.  A Vercel irá detectar automaticamente que é um projeto Vite/React e preencher as configurações de build. Você não precisa alterar nada aqui.
5.  Antes de fazer o deploy, vá para a seção **"Environment Variables" (Variáveis de Ambiente)**.

### Passo 3: Configurar as Variáveis de Ambiente

Este é o passo mais importante para a segurança e funcionalidade do seu aplicativo. Adicione as seguintes variáveis:

| Chave (Key)               | Valor (Value)                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_KEY`                 | Sua chave de API do **Google Gemini**. Obtenha em [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).                                   |
| `STRIPE_SECRET_KEY`       | Sua chave secreta do **Stripe** em modo de **PRODUÇÃO** (`sk_live_...`). Obtenha no [painel do Stripe](https://dashboard.stripe.com/apikeys).                   |
| `WEBAPP_URL`              | A URL principal do seu site (Ex: `https://meu-site.vercel.app` ou `https://www.meusite.com.br`).                                                              |
| `STRIPE_WEBHOOK_SECRET`   | **Deixe em branco por enquanto.** Você obterá este valor no Passo 5, após o primeiro deploy.                                                                 |

Com as três primeiras variáveis configuradas, clique em **"Deploy"**.

### Passo 4: Obter a URL de Produção

Aguarde a conclusão do deploy. A Vercel fornecerá a URL principal do seu site (ex: `meu-projeto.vercel.app`). Copie esta URL.

### Passo 5: Configurar o Webhook do Stripe para Produção

O webhook permite que o Stripe notifique seu aplicativo quando um pagamento for concluído.

1.  Vá para o **Stripe Dashboard** (certifique-se de estar em modo de **PRODUÇÃO**).
2.  Navegue até **"Desenvolvedores" -> "Webhooks"**.
3.  Clique em **"+ Adicionar um endpoint"**.
4.  No campo **"URL do endpoint"**, cole a URL do seu site (do Passo 4) e adicione `/api/stripe-webhook` no final.
    *   Exemplo: `https://meu-projeto.vercel.app/api/stripe-webhook`
5.  Em **"Eventos para enviar"**, selecione os seguintes eventos:
    *   `checkout.session.completed`
    *   `customer.subscription.updated`
    *   `customer.subscription.deleted`
6.  Clique em **"Adicionar endpoint"**.
7.  Na página de detalhes do webhook que você acabou de criar, encontre a seção **"Segredo de assinatura"** e clique para **revelar**. Copie o segredo (começa com `whsec_...`).

### Passo 6: Adicionar o Segredo do Webhook na Vercel

1.  Volte para o painel do seu projeto na **Vercel**.
2.  Vá para **"Settings" -> "Environment Variables"**.
3.  Adicione a última variável de ambiente:
    *   Chave: `STRIPE_WEBHOOK_SECRET`
    *   Valor: Cole o segredo que você copiou do Stripe.
4.  Salve as alterações.

### Passo 7: Fazer o Redeploy

Para que a nova variável do webhook seja aplicada, você precisa fazer o "redeploy" do seu projeto.

1.  Na Vercel, vá para a aba **"Deployments"** do seu projeto.
2.  Encontre o último deploy bem-sucedido.
3.  Clique no menu de três pontos (...) e selecione **"Redeploy"**.

**Pronto!** Seu aplicativo está totalmente configurado e funcionando em produção.
