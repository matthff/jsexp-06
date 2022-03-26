## Estrutura do projeto

##### Divisão de Responsabilidade

- Server
  - Service = tudo que é regra de negócio e relacionado
  - Controller = intermediar a camada de apresentação e a camada de negócio
  - Routes = simplesmente a camada de apresentação que interage com o usuário
  - Server = responsável por criar o servidor, mas não instancia ele
  - Index = instancia o servidor e expõe para a web, é o lado da infraestrutura
  - Config = tudo que for estático no projeto, faz parte deste pacote


#### Last session timestamp in the videos: Aula 02 at 01h:10min:00s
