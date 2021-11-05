CONSTITUIÇÃO DA BASE DE DADOS:

USER TEM:

- NOME
- EMAIL
- PASSWORD
- TREINOS GUARDADOS (OPCIONAL NESTA FASE)
- PESO
- ALTURA
- Idade
- EXERCICIOS FAVORITOS (OPCIONAL NESTA FASE)

TREINOS:

- ID{

  - CRIADO POR:
  - TIPO
  - DURACAO
  - GRUPO MUSCULAR
  - PREÇO
  - EXERCICIOS: [
    {

    - ID
    - NOME
    - TOTAL DE SETS
    - REPETIÇOES
    - DESCANSO
    - IMAGE
      }
      ]}

     <div class="navbar-nav ml-auto">
        <% if(!currentUser) {%>
        <a class="nav-link" href="/login">Login</a>
        <a class="nav-link" href="/register">Register</a>
        <% } else {%>
        <a class="nav-link" href="/logout">Logout</a>
        <% } %>
      </div>
