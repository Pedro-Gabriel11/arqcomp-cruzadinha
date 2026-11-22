// =====================================================
// 1. O DESENHO DO TABULEIRO (o Grimório)
// Letra = casa onde o jogador escreve | Ponto (.) = casa preta
// =====================================================
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

// =====================================================
// 2. AS PALAVRAS
// Cada palavra é uma "ficha" (objeto) com: número da pista, resposta,
// linha e coluna onde começa, direção (H ou V) e se já foi acertada
// =====================================================
var palavras = [
    { numero: 1,  resposta: "MICROCONTROLADOR", linha: 0,  coluna: 0,  direcao: "H", acertada: false },
    { numero: 6,  resposta: "EEPROM",           linha: 2,  coluna: 4,  direcao: "H", acertada: false },
    { numero: 7,  resposta: "QUADCORE",         linha: 4,  coluna: 5,  direcao: "H", acertada: false },
    { numero: 10, resposta: "FLASH",            linha: 6,  coluna: 9,  direcao: "H", acertada: false },
    { numero: 11, resposta: "DMA",              linha: 7,  coluna: 0,  direcao: "H", acertada: false },
    { numero: 12, resposta: "DATABUS",          linha: 8,  coluna: 7,  direcao: "H", acertada: false },
    { numero: 13, resposta: "ROM",              linha: 11, coluna: 2,  direcao: "H", acertada: false },
    { numero: 14, resposta: "CACHE",            linha: 11, coluna: 11, direcao: "H", acertada: false },
    { numero: 1,  resposta: "MEMORIADEMASSA",   linha: 0,  coluna: 0,  direcao: "V", acertada: false },
    { numero: 2,  resposta: "CPU",              linha: 0,  coluna: 2,  direcao: "V", acertada: false },
    { numero: 3,  resposta: "RAM",              linha: 0,  coluna: 9,  direcao: "V", acertada: false },
    { numero: 4,  resposta: "ADDRESSBUS",       linha: 0,  coluna: 12, direcao: "V", acertada: false },
    { numero: 5,  resposta: "REGISTRADORES",    linha: 0,  coluna: 15, direcao: "V", acertada: false },
    { numero: 8,  resposta: "ULA",              linha: 4,  coluna: 6,  direcao: "V", acertada: false },
    { numero: 9,  resposta: "DUALCORE",         linha: 5,  coluna: 2,  direcao: "V", acertada: false }
];

// =====================================================
// 3. OS MONSTROS DA MASMORRA
// "ate" = quantas palavras certas (no total) são precisas para derrotá-lo
// "ataque" = dano base que ele causa no herói a cada turno
// =====================================================
var inimigos = [
    { nome: "Rato do Barramento",   emoji: "🐀", ate: 3,  ataque: 6 },
    { nome: "Esqueleto da ROM",     emoji: "💀", ate: 7,  ataque: 9 },
    { nome: "Guardião Corrompido",  emoji: "🐉", ate: 15, ataque: 12 }
];

var DANO_POR_PALAVRA = 10;   // cada palavra certa tira 10 de vida do monstro
var VIDA_MAXIMA_HEROI = 100;

// Variáveis do estado do jogo (o Reiniciar volta todas ao início)
var vidaHeroi = VIDA_MAXIMA_HEROI;
var acertos = 0;
var jogoAcabou = false;
// >>> extra
var pocoes = 2;
var pergaminhos = 3;
// <<< extra

// =====================================================
// 4. DESENHAR O TABULEIRO NA TELA
// =====================================================
function desenharTabuleiro() {
    var html = "";

    for (var linha = 0; linha < mapa.length; linha++) {
        for (var coluna = 0; coluna < mapa[linha].length; coluna++) {
            var letra = mapa[linha][coluna];

            if (letra == ".") {
                html += '<div class="casa preta"></div>';
            } else {
                // Procura se alguma palavra começa nesta casa, para pôr o número
                var numero = "";
                for (var i = 0; i < palavras.length; i++) {
                    if (palavras[i].linha == linha && palavras[i].coluna == coluna) {
                        numero = palavras[i].numero;
                    }
                }

                html += '<div class="casa">' +
                            '<span class="numero">' + numero + '</span>' +
                            '<input id="ipt_' + linha + '_' + coluna + '" maxlength="1">' +
                        '</div>';
            }
        }
    }

    tabuleiro.innerHTML = html;
}

// Devolve o input de uma casa. Como o id é montado com variáveis
// (ex.: "ipt_3_12"), usamos document.getElementById para encontrá-lo.
function pegarCasa(linha, coluna) {
    return document.getElementById("ipt_" + linha + "_" + coluna);
}

// Devolve a linha e a coluna da letra número "k" de uma palavra
function linhaDaLetra(palavra, k) {
    if (palavra.direcao == "V") {
        return palavra.linha + k;   // na vertical, a linha muda
    }
    return palavra.linha;
}

function colunaDaLetra(palavra, k) {
    if (palavra.direcao == "H") {
        return palavra.coluna + k;  // na horizontal, a coluna muda
    }
    return palavra.coluna;
}

// =====================================================
// 5. FUNÇÕES DA BATALHA
// =====================================================

// Descobre qual monstro está lutando agora, de acordo com os acertos
function inimigoAtual() {
    for (var i = 0; i < inimigos.length; i++) {
        if (acertos < inimigos[i].ate) {
            return i;
        }
    }
    return inimigos.length - 1;   // todos derrotados: fica no último
}

// Escreve uma mensagem no topo do registro da batalha
function escreverLog(mensagem) {
    div_log.innerHTML = "<p>" + mensagem + "</p>" + div_log.innerHTML;
}

// Faz um elemento "tremer" por meio segundo (animação do CSS)
function tremer(elemento) {
    elemento.className = "avatar tremendo";
    setTimeout(function () {
        elemento.className = "avatar";
    }, 500);
}

// O monstro atual ataca o herói. "bonus" = dano extra
function turnoDoInimigo(bonus) {
    var monstro = inimigos[inimigoAtual()];

    // Dano = ataque do monstro + um valor sorteado de 0 a 4 + bônus
    var dano = monstro.ataque + Math.floor(Math.random() * 5) + bonus;
    vidaHeroi = vidaHeroi - dano;
    if (vidaHeroi < 0) {
        vidaHeroi = 0;
    }

    tremer(avatar_heroi);
    escreverLog(monstro.emoji + " " + monstro.nome + " atacou! Você perdeu <b>" + dano + "</b> de vida.");

    if (vidaHeroi == 0) {
        jogoAcabou = true;
        escreverLog("☠️ <b>GAME OVER!</b> Você caiu na masmorra. Clique em Reiniciar para tentar de novo.");
    }
}

// Atualiza barras de vida, textos e botões na tela
function atualizarTela() {
    var i = inimigoAtual();
    var monstro = inimigos[i];

    // Vida do monstro: quantas palavras ainda faltam para derrotá-lo x 10
    var inicio = 0;
    if (i > 0) {
        inicio = inimigos[i - 1].ate;
    }
    var vidaMaximaInimigo = (monstro.ate - inicio) * DANO_POR_PALAVRA;
    var vidaInimigo = (monstro.ate - acertos) * DANO_POR_PALAVRA;
    if (vidaInimigo < 0) {
        vidaInimigo = 0;
    }

    // As barras de vida são divs cuja largura (width) vai de 0% a 100%
    barra_heroi.style.width = (vidaHeroi / VIDA_MAXIMA_HEROI * 100) + "%";
    barra_inimigo.style.width = (vidaInimigo / vidaMaximaInimigo * 100) + "%";

    txt_vida_heroi.innerHTML = "❤️ " + vidaHeroi + " / " + VIDA_MAXIMA_HEROI;
    txt_vida_inimigo.innerHTML = "❤️ " + vidaInimigo + " / " + vidaMaximaInimigo;
    avatar_inimigo.innerHTML = monstro.emoji;
    txt_nome_inimigo.innerHTML = monstro.nome;
    txt_sala.innerHTML = "Sala " + (i + 1) + " de " + inimigos.length;
    txt_contador.innerHTML = "📜 " + acertos + " de " + palavras.length + " palavras";

    // >>> extra
    btn_pocao.innerHTML = "🧪 Poção (" + pocoes + ")";
    btn_pergaminho.innerHTML = "🔮 Pergaminho de pista (" + pergaminhos + ")";
    btn_pocao.disabled = jogoAcabou || pocoes == 0;
    btn_pergaminho.disabled = jogoAcabou || pergaminhos == 0;
    // <<< extra
    btn_conferir.disabled = jogoAcabou;
}

// =====================================================
// 6. BOTÃO CONFERIR = o turno de ataque do herói
// =====================================================
function conferir() {
    if (jogoAcabou) {
        return;
    }

    var inimigoAntes = inimigoAtual();
    var novosAcertos = 0;
    var erradas = 0;

    // Primeiro, tira a marcação vermelha das casas que ainda não estão certas
    for (var i = 0; i < palavras.length; i++) {
        for (var k = 0; k < palavras[i].resposta.length; k++) {
            var casa = pegarCasa(linhaDaLetra(palavras[i], k), colunaDaLetra(palavras[i], k));
            if (casa.className == "errada") {
                casa.className = "";
            }
        }
    }

    // Agora confere palavra por palavra
    for (var i = 0; i < palavras.length; i++) {
        var palavra = palavras[i];
        var pista = document.getElementById("pista_" + palavra.direcao + palavra.numero);

        if (palavra.acertada) {
            continue;   // já foi acertada antes: pula para a próxima
        }

        // Junta as letras que o jogador digitou nas casas desta palavra
        var digitado = "";
        for (var k = 0; k < palavra.resposta.length; k++) {
            var casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
            digitado += casa.value.toUpperCase();
        }

        if (digitado == palavra.resposta) {
            // ACERTOU: pinta de verde e trava as casas
            palavra.acertada = true;
            novosAcertos++;
            pista.className = "certa";
            for (var k = 0; k < palavra.resposta.length; k++) {
                var casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
                casa.className = "certa";
                casa.disabled = true;
            }
        } else if (digitado.length == palavra.resposta.length) {
            // Palavra completa, mas ERRADA: pinta de vermelho
            erradas++;
            pista.className = "errada";
            for (var k = 0; k < palavra.resposta.length; k++) {
                var casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
                if (casa.className != "certa") {
                    casa.className = "errada";
                }
            }
        } else {
            // Palavra incompleta: não conta nem como certa nem como errada
            pista.className = "";
        }
    }

    acertos = acertos + novosAcertos;

    // ----- Resultado do ataque do herói -----
    if (novosAcertos > 0) {
        var monstroAtacado = inimigos[inimigoAntes];
        tremer(avatar_inimigo);
        escreverLog("✨ Você lançou " + novosAcertos + " feitiço(s)! " + monstroAtacado.nome +
                    " sofreu <b>" + (novosAcertos * DANO_POR_PALAVRA) + "</b> de dano.");
    } else {
        escreverLog("💨 Nenhum feitiço novo funcionou neste turno...");
    }

    // ----- Verifica vitória e troca de monstro -----
    if (acertos == palavras.length) {
        jogoAcabou = true;
        escreverLog("🏆 <b>VITÓRIA!</b> O Guardião Corrompido foi derrotado e a placa-mãe está livre!");
    } else if (inimigoAtual() != inimigoAntes) {
        // O monstro anterior morreu (pode ter morrido mais de um no mesmo turno)
        for (var m = inimigoAntes; m < inimigoAtual(); m++) {
            escreverLog("⚰️ " + inimigos[m].nome + " foi derrotado!");
        }
        var novo = inimigos[inimigoAtual()];
        escreverLog("🚪 Você avança para a próxima sala... " + novo.emoji + " " + novo.nome + " aparece!");
    } else {
        // O monstro sobreviveu: é a vez dele atacar (+4 de dano por palavra errada)
        if (erradas > 0) {
            escreverLog("❌ " + erradas + " palavra(s) errada(s)! O monstro aproveita a brecha e ataca mais forte.");
        }
        turnoDoInimigo(erradas * 4);
    }

    atualizarTela();
}

// >>> extra
// =====================================================
// 7. ITENS: POÇÃO E PERGAMINHO (também gastam o turno!)
// =====================================================
function usarPocao() {
    if (jogoAcabou || pocoes == 0) {
        return;
    }

    pocoes--;
    vidaHeroi = vidaHeroi + 30;
    if (vidaHeroi > VIDA_MAXIMA_HEROI) {
        vidaHeroi = VIDA_MAXIMA_HEROI;
    }
    escreverLog("🧪 Você bebeu uma poção e recuperou vida!");

    turnoDoInimigo(0);
    atualizarTela();
}

function usarPergaminho() {
    if (jogoAcabou || pergaminhos == 0) {
        return;
    }

    // Monta uma lista com as casas vazias ou com letra errada
    var casasParaRevelar = [];
    var letrasCorretas = [];
    for (var linha = 0; linha < mapa.length; linha++) {
        for (var coluna = 0; coluna < mapa[linha].length; coluna++) {
            var letra = mapa[linha][coluna];
            if (letra != ".") {
                var casa = pegarCasa(linha, coluna);
                if (casa.value.toUpperCase() != letra) {
                    casasParaRevelar.push(casa);
                    letrasCorretas.push(letra);
                }
            }
        }
    }

    if (casasParaRevelar.length == 0) {
        escreverLog("🔮 Todas as letras já estão certas. Clique em Conferir!");
        return;
    }

    // Sorteia uma dessas casas e escreve a letra certa nela
    var sorteio = Math.floor(Math.random() * casasParaRevelar.length);
    casasParaRevelar[sorteio].value = letrasCorretas[sorteio];
    casasParaRevelar[sorteio].className = "revelada";

    pergaminhos--;
    escreverLog("🔮 O pergaminho revelou uma letra do grimório!");

    turnoDoInimigo(0);
    atualizarTela();
}
// <<< extra

// =====================================================
// 8. BOTÃO REINICIAR
// =====================================================
function reiniciar() {
    vidaHeroi = VIDA_MAXIMA_HEROI;
    acertos = 0;
    jogoAcabou = false;
    // >>> extra
    pocoes = 2;
    pergaminhos = 3;
    // <<< extra

    for (var i = 0; i < palavras.length; i++) {
        palavras[i].acertada = false;
        document.getElementById("pista_" + palavras[i].direcao + palavras[i].numero).className = "";
    }

    desenharTabuleiro();   // desenha o tabuleiro de novo, todo vazio
    div_log.innerHTML = "";
    escreverLog("🗝️ Você entra na masmorra... um " + inimigos[0].emoji + " " + inimigos[0].nome + " bloqueia o caminho!");
    atualizarTela();
}

// Começa o jogo assim que a página carrega
reiniciar();
