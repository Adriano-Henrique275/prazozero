# 📦 Controle de Produtos

Aplicação web moderna e responsiva para cadastro, listagem e gerenciamento de produtos com controle de validade.
Vercel
Next.js Tailwind CSS

## ✨ Funcionalidades

- ✅ Cadastro de produtos com validação e feedback visual
- ✅ Visualização em cards com status de validade (Ok, Vencendo, Vencido)
- ✅ Busca por nome e filtro por data de vencimento
- ✅ Toasts de alerta para vencimentos do dia
- ✅ Edição e exclusão com confirmação customizada
- ✅ Paginação e UX refinada com animações suaves
- ✅ Deploy automático via Vercel e favicon personalizado

## ⚙️ Tecnologias e libs

- Next.js 14 App Router
- React Hook Form + Zod
- Tailwind CSS + Dark Theme
- React Icons
- Prisma ORM + PostgreSQL
- Vercel Hosting
- date-fns para formatação de datas
- react-hot-toast para notificações
- Deploy e CI/CD via GitHub + Vercel

## 🧪 Como rodar local

git clone [Github]("https://github.com/Adriano-Henrique275/prazozero")
cd prazozero
npm install
npm run dev

Certifique-se de ter o Node.js e o NPM instalados

📁 Organização
├── app/
│ ├── page.tsx
│ └── produtos/...
├── components/
│ ├── ui/ (Botões, Inputs, Labels...)
│ └── ProductCard.tsx
├── lib/
│ ├── prisma.ts
│ └── validators/
├── public/
│ └── favicon.ico

## 🚀 Deploy

Aplicação publicada na Vercel com ambiente de produção automatizado via vercel --prod.

### 🧠 Autor

Feito com ♥ por Adriano Henrique.
Se curtiu esse projeto, não esquece de deixar uma ⭐ no repositório!
