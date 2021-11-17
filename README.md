# FLAGFinalProject

**NOTA IMPORTANTE: Para testar a APP é necessário fazer seed do ficheiro "Exercises.Json", senão vai dar erro ao tentar adicionar exercicios a um treino.**

Na linha de comandos escreva: "node seeder -i". Se pretender popular a BD com mais algum dos ficheiros Json simplesmente entre no ficheiro "seeder.js" e remova as linhas comentadas na função "importData";

Funcionalidades da APP:

---> Em termos de utilizadores:

- Registar utilizadores num processo com 2 fases: Dados básicos de Signup (nome,email,pass), seguido de um processo de inserção de dados em que o utilizador especifica não só as suas medidas(altura,peso,idade),mas tambem o seu objetivo e nível de experiência.
- Login
- Logout
- Editar Perfil (utiliza-se a mesma rota quer para editar quer para cumprir a fase 2 do processo de registo).

---> Em termos de Exercicios:

- Adicionar Exercicios, com opção de fazer upload de multiplas imagens que serão guardadas, não nos ficheiros do projeto, mas sim em Cloudinary de forma a evitar que o projeto se torne pesado.
- Remover Exercicios
- Editar Exercicios
- Adicionar e Remover Exercicios dos favoritos.
- Filtrar por Grupo Muscular

---> Em termos de Treinos:

- Criar Treinos também com upload para Cloudinary
- Remover Treinos
- Editar Treinos
- Adicionar e Remover Treinos dos favoritos.
- Filtrar por Grupo Muscular
- Adicionar/Remover Exercicios ao Treino, em que especificamos não só o nome do exercicio mas também o número de sets,reps e descanso.
