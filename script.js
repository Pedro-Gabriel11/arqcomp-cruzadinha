
let mapa = [
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

let palavras = [
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


let inimigos = [
    { nome: "Rato do Barramento",   emoji: "🐀", ate: 3,  ataque: 6 },
    { nome: "Esqueleto da ROM",     emoji: "💀", ate: 7,  ataque: 9 },
    { nome: "Guardião Corrompido",  emoji: "🐉", ate: 15, ataque: 12 }
];

let DANO_POR_PALAVRA = 10;   
let VIDA_MAXIMA_HEROI = 100;

let vidaHeroi = VIDA_MAXIMA_HEROI;
let acertos = 0;
let jogoAcabou = false;
let pocoes = 2;
let pergaminhos = 3;

function desenharTabuleiro() {
    let html = "";

    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            let letra = mapa[linha][coluna];

            if (letra == ".") {
                html += '<div class="casa preta"></div>';
            } else {
                let numero = "";
                for (let i = 0; i < palavras.length; i++) {
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

function pegarCasa(linha, coluna) {
    return document.getElementById("ipt_" + linha + "_" + coluna);
}

function linhaDaLetra(palavra, k) {
    if (palavra.direcao == "V") {
        return palavra.linha + k;   // na vertical, a linha muda
    }
    return palavra.linha;
}

function colunaDaLetra(palavra, k) {
    if (palavra.direcao == "H") {
        return palavra.coluna + k;  
    }
    return palavra.coluna;
}

function inimigoAtual() {
    for (let i = 0; i < inimigos.length; i++) {
        if (acertos < inimigos[i].ate) {
            return i;
        }
    }
    return inimigos.length - 1;   
}

function escreverLog(mensagem) {
    div_log.innerHTML = "<p>" + mensagem + "</p>" + div_log.innerHTML;
}

function tremer(elemento) {
    elemento.className = "avatar tremendo";
    setTimeout(function () {
        elemento.className = "avatar";
    }, 500);
}

function turnoDoInimigo(bonus) {
    let monstro = inimigos[inimigoAtual()];

    let dano = monstro.ataque + Math.floor(Math.random() * 5) + bonus;
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

function atualizarTela() {
    let i = inimigoAtual();
    let monstro = inimigos[i];

    let inicio = 0;
    if (i > 0) {
        inicio = inimigos[i - 1].ate;
    }
    let vidaMaximaInimigo = (monstro.ate - inicio) * DANO_POR_PALAVRA;
    let vidaInimigo = (monstro.ate - acertos) * DANO_POR_PALAVRA;
    if (vidaInimigo < 0) {
        vidaInimigo = 0;
    }

    barra_heroi.style.width = (vidaHeroi / VIDA_MAXIMA_HEROI * 100) + "%";
    barra_inimigo.style.width = (vidaInimigo / vidaMaximaInimigo * 100) + "%";

    txt_vida_heroi.innerHTML = "❤️ " + vidaHeroi + " / " + VIDA_MAXIMA_HEROI;
    txt_vida_inimigo.innerHTML = "❤️ " + vidaInimigo + " / " + vidaMaximaInimigo;
    avatar_inimigo.innerHTML = monstro.emoji;
    txt_nome_inimigo.innerHTML = monstro.nome;
    txt_sala.innerHTML = "Sala " + (i + 1) + " de " + inimigos.length;
    txt_contador.innerHTML = "📜 " + acertos + " de " + palavras.length + " palavras";

    btn_pocao.innerHTML = "🧪 Poção (" + pocoes + ")";
    btn_pergaminho.innerHTML = "🔮 Pergaminho de pista (" + pergaminhos + ")";
    btn_pocao.disabled = jogoAcabou || pocoes == 0;
    btn_pergaminho.disabled = jogoAcabou || pergaminhos == 0;
    btn_conferir.disabled = jogoAcabou;
}

function conferir() {
    if (jogoAcabou) {
        return;
    }

    let inimigoAntes = inimigoAtual();
    let novosAcertos = 0;
    let erradas = 0;

    for (let i = 0; i < palavras.length; i++) {
        for (let k = 0; k < palavras[i].resposta.length; k++) {
            let casa = pegarCasa(linhaDaLetra(palavras[i], k), colunaDaLetra(palavras[i], k));
            if (casa.className == "errada") {
                casa.className = "";
            }
        }
    }

    for (let i = 0; i < palavras.length; i++) {
        let palavra = palavras[i];
        let pista = document.getElementById("pista_" + palavra.direcao + palavra.numero);

        if (palavra.acertada) {
            continue;  
        }

        let digitado = "";
        for (let k = 0; k < palavra.resposta.length; k++) {
            let casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
            digitado += casa.value.toUpperCase();
        }

        if (digitado == palavra.resposta) {
            palavra.acertada = true;
            novosAcertos++;
            pista.className = "certa";
            for (let k = 0; k < palavra.resposta.length; k++) {
                let casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
                casa.className = "certa";
                casa.disabled = true;
            }
        } else if (digitado.length == palavra.resposta.length) {
            erradas++;
            pista.className = "errada";
            for (let k = 0; k < palavra.resposta.length; k++) {
                let casa = pegarCasa(linhaDaLetra(palavra, k), colunaDaLetra(palavra, k));
                if (casa.className != "certa") {
                    casa.className = "errada";
                }
            }
        } else {
            pista.className = "";
        }
    }

    acertos = acertos + novosAcertos;

    if (novosAcertos > 0) {
        let monstroAtacado = inimigos[inimigoAntes];
        tremer(avatar_inimigo);
        escreverLog("✨ Você lançou " + novosAcertos + " feitiço(s)! " + monstroAtacado.nome +
                    " sofreu <b>" + (novosAcertos * DANO_POR_PALAVRA) + "</b> de dano.");
    } else {
        escreverLog("💨 Nenhum feitiço novo funcionou neste turno...");
    }

    if (acertos == palavras.length) {
        jogoAcabou = true;
        escreverLog("🏆 <b>VITÓRIA!</b> O Guardião Corrompido foi derrotado e a placa-mãe está livre!");
    } else if (inimigoAtual() != inimigoAntes) {
        for (let m = inimigoAntes; m < inimigoAtual(); m++) {
            escreverLog("⚰️ " + inimigos[m].nome + " foi derrotado!");
        }
        let novo = inimigos[inimigoAtual()];
        escreverLog("🚪 Você avança para a próxima sala... " + novo.emoji + " " + novo.nome + " aparece!");
    } else {
        if (erradas > 0) {
            escreverLog("❌ " + erradas + " palavra(s) errada(s)! O monstro aproveita a brecha e ataca mais forte.");
        }
        turnoDoInimigo(erradas * 4);
    }

    atualizarTela();
}

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

    let casasParaRevelar = [];
    let letrasCorretas = [];
    for (let linha = 0; linha < mapa.length; linha++) {
        for (let coluna = 0; coluna < mapa[linha].length; coluna++) {
            let letra = mapa[linha][coluna];
            if (letra != ".") {
                let casa = pegarCasa(linha, coluna);
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

    let sorteio = Math.floor(Math.random() * casasParaRevelar.length);
    casasParaRevelar[sorteio].value = letrasCorretas[sorteio];
    casasParaRevelar[sorteio].className = "revelada";

    pergaminhos--;
    escreverLog("🔮 O pergaminho revelou uma letra do grimório!");

    turnoDoInimigo(0);
    atualizarTela();
}

function reiniciar() {
    vidaHeroi = VIDA_MAXIMA_HEROI;
    acertos = 0;
    jogoAcabou = false;
    pocoes = 2;
    pergaminhos = 3;

    for (let i = 0; i < palavras.length; i++) {
        palavras[i].acertada = false;
        document.getElementById("pista_" + palavras[i].direcao + palavras[i].numero).className = "";
    }

    desenharTabuleiro();  
    div_log.innerHTML = "";
    escreverLog("🗝️ Você entra na masmorra... um " + inimigos[0].emoji + " " + inimigos[0].nome + " bloqueia o caminho!");
    atualizarTela();
}
reiniciar();
