// ===== 1. O DESENHO DO TABULEIRO =====
// Cada texto é uma linha do tabuleiro.
// Letra = casa onde o jogador escreve | Ponto (.) = casa preta
var mapa = [
    "MICROCONTROLADOR",
    "E.P......A..D..E",
    "M.U.EEPROM..D..G",
    "O...........R..I",
    "R....QUADCORE..S",
    "I.D...L.....S..T",
    "A.U...A..FLASH.R",
    "DMA.........B..A",
    "E.L....DATABUS.D",
    "M.C.........S..O",
    "A.O............R",
    "S.ROM......CACHE",
    "S.E............S",
    "A..............."
];

// ===== 2. AS PALAVRAS =====
// Cada palavra é uma "ficha" com: número da pista, resposta,
// linha e coluna onde ela começa, e direção (H = horizontal, V = vertical)
var palavras = [
    { numero: 1,  resposta: "MICROCONTROLADOR", linha: 0,  coluna: 0,  direcao: "H" },
    { numero: 6,  resposta: "EEPROM",           linha: 2,  coluna: 4,  direcao: "H" },
    { numero: 7,  resposta: "QUADCORE",         linha: 4,  coluna: 5,  direcao: "H" },
    { numero: 10, resposta: "FLASH",            linha: 6,  coluna: 9,  direcao: "H" },
    { numero: 11, resposta: "DMA",              linha: 7,  coluna: 0,  direcao: "H" },
    { numero: 12, resposta: "DATABUS",          linha: 8,  coluna: 7,  direcao: "H" },
    { numero: 13, resposta: "ROM",              linha: 11, coluna: 2,  direcao: "H" },
    { numero: 14, resposta: "CACHE",            linha: 11, coluna: 11, direcao: "H" },
    { numero: 1,  resposta: "MEMORIADEMASSA",   linha: 0,  coluna: 0,  direcao: "V" },
    { numero: 2,  resposta: "CPU",              linha: 0,  coluna: 2,  direcao: "V" },
    { numero: 3,  resposta: "RAM",              linha: 0,  coluna: 9,  direcao: "V" },
    { numero: 4,  resposta: "ADDRESSBUS",       linha: 0,  coluna: 12, direcao: "V" },
    { numero: 5,  resposta: "REGISTRADORES",    linha: 0,  coluna: 15, direcao: "V" },
    { numero: 8,  resposta: "ULA",              linha: 4,  coluna: 6,  direcao: "V" },
    { numero: 9,  resposta: "DUALCORE",         linha: 5,  coluna: 2,  direcao: "V" }
];

// ===== 3. DESENHAR O TABULEIRO NA TELA =====
function desenharTabuleiro() {
    var html = "";

    // Um for para as linhas...
    for (var linha = 0; linha < mapa.length; linha++) {
        // ...e outro for, dentro dele, para as colunas
        for (var coluna = 0; coluna < mapa[linha].length; coluna++) {
            var letra = mapa[linha][coluna];

            if (letra == ".") {
                // Casa preta: só uma div vazia
                html += '<div class="casa preta"></div>';
            } else {
                // Casa de letra: procura se alguma palavra começa aqui
                var numero = "";
                for (var i = 0; i < palavras.length; i++) {
                    if (palavras[i].linha == linha && palavras[i].coluna == coluna) {
                        numero = palavras[i].numero;
                    }
                }

                // Cada input recebe um id com a sua posição. Ex.: ipt_3_12
                html += '<div class="casa">' +
                            '<span class="numero">' + numero + '</span>' +
                            '<input id="ipt_' + linha + '_' + coluna + '" maxlength="1">' +
                        '</div>';
            }
        }
    }

    tabuleiro.innerHTML = html;
}

// Chama a função assim que a página carrega
desenharTabuleiro();
