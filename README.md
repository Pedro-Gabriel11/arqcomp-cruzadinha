# ⚔️ A Masmorra da Placa-Mãe

Um RPG de turnos em que a sua arma é uma **cruzadinha de Arquitetura Computacional**.

O Guardião Corrompido tomou conta da masmorra escondida dentro do computador. Para derrotá-lo, você usa os feitiços do **Grimório Arcano**: cada palavra que você decifrar no tabuleiro vira um ataque contra os monstros.

🔗 **Jogue aqui:** https://Pedro-Gabriel11.github.io/Jogo-de-Arq-Comp/

## Como jogar

1. Leia as pistas (Horizontais e Verticais) e digite as letras direto nas casas do Grimório.
2. Clique em **⚔️ Conferir (atacar)** para usar o seu turno:
   - cada palavra **nova e certa** fica verde e causa 10 de dano ao monstro;
   - cada palavra **completa e errada** fica vermelha e deixa o monstro atacar mais forte;
   - depois do seu ataque, se o monstro sobreviver, ele contra-ataca.
3. Derrote os 3 monstros, um em cada sala da masmorra:
   - 🐀 **Rato do Barramento**: 3 palavras;
   - 💀 **Esqueleto da ROM**: mais 4 palavras;
   - 🐉 **Guardião Corrompido**: as 8 palavras restantes.
4. Use os itens com sabedoria, porque eles também gastam o turno:
   - 🧪 **Poção** (2 usos): recupera 30 de vida;
   - 🔮 **Pergaminho de pista** (3 usos): revela uma letra do tabuleiro.
5. O contador mostra o seu progresso (ex.: "8 de 15 palavras").
6. Se a sua vida chegar a zero, é **Game Over**. Clique em **🔄 Reiniciar** para limpar o tabuleiro e começar de novo.

## Palavras e pistas

### Horizontais
| Nº | Palavra | Pista |
|---|---|---|
| 1 | MICROCONTROLADOR | Circuito integrado que reúne processador, memória e periféricos em um único chip. |
| 6 | EEPROM | Memória não volátil, apagável eletricamente byte a byte, usada para guardar configurações. |
| 7 | QUADCORE | Processador que possui quatro núcleos de processamento. |
| 10 | FLASH | Memória não volátil utilizada em pendrives e cartões de memória. |
| 11 | DMA | Recurso que permite aos periféricos transferirem informações sem ocupar o processador. |
| 12 | DATABUS | Vias de mão dupla que levam o conteúdo lido ou gravado na memória. |
| 13 | ROM | Memória gravada de fábrica, como a que guarda o firmware de inicialização do computador. |
| 14 | CACHE | Memória rápida que guarda dados frequentemente utilizados para acelerar o processamento. |

### Verticais
| Nº | Palavra | Pista |
|---|---|---|
| 1 | MEMORIADEMASSA | Onde arquivos e programas ficam guardados mesmo com o computador desligado, como HD e SSD. |
| 2 | CPU | O cérebro do computador: busca, decodifica e executa as instruções dos programas. |
| 3 | RAM | Memória temporária que armazena dados e programas em uso pelo computador. |
| 4 | ADDRESSBUS | Vias de mão única por onde o processador indica qual posição deseja acessar. |
| 5 | REGISTRADORES | Pequenas unidades de armazenamento de altíssima velocidade localizadas dentro do processador. |
| 8 | ULA | Circuito dentro do processador que soma, subtrai e compara valores. |
| 9 | DUALCORE | Processador que possui dois núcleos de processamento. |

## Tecnologias

HTML, CSS e JavaScript puros. Projeto da disciplina de Arquitetura Computacional — SPTech.
