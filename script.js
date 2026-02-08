document.addEventListener('DOMContentLoaded', function () {

    const resultadoMedia = document.getElementById("resultado-media");
    const resultadoVariacao = document.getElementById("resultado-variacao");

    // MODAL

    const btnConfig = document.getElementById("btn-config");
    const modal = document.getElementById("modal-config");

    const btnFechar = document.getElementById("btn-fechar");
    const btnSalvar = document.getElementById("btn-salvar");

    const inputInex = document.getElementById("param-inex");
    const inputExc = document.getElementById("param-exc");


    let parametros = {
        inexequivel: 15,
        excessivo: 15
    };

    function carregarParametros() {
        const salvo = localStorage.getItem("parametrosPrecos");

        if (salvo) {
            parametros = JSON.parse(salvo);
        }

        // Atualiza campos do modal
        inputInex.value = parametros.inexequivel;
        inputExc.value = parametros.excessivo;
    }


    function salvarParametros() {
        parametros.inexequivel = parseFloat(inputInex.value);
        parametros.excessivo = parseFloat(inputExc.value);

        localStorage.setItem("parametrosPrecos", JSON.stringify(parametros));

        alert("Parâmetros salvos com sucesso!");
        fecharModal();
    }



    function abrirModal() {
        modal.style.display = "flex";
    }

    function fecharModal() {
        modal.style.display = "none";
    }




    btnConfig.addEventListener("click", function (e) {
        e.preventDefault();
        abrirModal();
    });

    btnFechar.addEventListener("click", fecharModal);

    btnSalvar.addEventListener("click", salvarParametros);

    // Fecha clicando fora da caixa
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            fecharModal();
        }
    });


    carregarParametros();


    // --------------------------------




    const btnLimpar = document.getElementById("btn-limpar");

    const btnCalcMed = document.getElementById('btn-calc-med');

    const inputsPrecos = [];

    for (let i = 1; i <= 10; i++) {
        inputsPrecos.push(document.getElementById(`preco${i}`));
    }

    function calcularMedia() {

        let soma = 0;
        let quantidade = 0;

        inputsPrecos.forEach((input) => {

            let valor = input.value.trim();

            if (valor !== "") {

                valor = valor.replace(",", ".");

                let numero = parseFloat(valor);

                if (!isNaN(numero)) {
                    soma += numero;
                    quantidade++;
                }
            }
        });

        if (quantidade === 0) {
            alert("Preencha pelo menos um preço.");
            return;
        }

        let media = soma / quantidade;

        return media;
    }

    function calcularVariacao() {

        let valores = [];

        inputsPrecos.forEach((input) => {

            let valor = input.value.trim();

            if (valor !== "") {

                valor = valor.replace(",", ".");

                let numero = parseFloat(valor);

                if (!isNaN(numero)) {
                    valores.push(numero);
                }
            }
        });

        if (valores.length < 2) {
            alert("Preencha pelo menos dois preços para calcular a variação percentual.");
            return;
        }

        let valorInicial = Math.min(...valores);

        let valorFinal = Math.max(...valores);

        let variacao = ((valorFinal - valorInicial) / valorInicial) * 100;

        return variacao;
    }

    function avaliarPrecos(media, parametros) {

        // Percorre todos os inputs
        inputsPrecos.forEach((input) => {

            let valorTexto = input.value.trim();
            let statusSpan = input.nextElementSibling; // <span class="status">

            // Limpa status anterior
            statusSpan.textContent = "";
            input.classList.remove("inex", "exc", "ok");

            // Ignora vazio
            if (valorTexto === "") return;

            // Converte vírgula → ponto
            valorTexto = valorTexto.replace(",", ".");
            let valor = parseFloat(valorTexto);

            if (isNaN(valor)) return;

            // ==============================
            // CLASSIFICAÇÃO
            // ==============================

            let porcentagemValor = valor * 100 / media;

            if (porcentagemValor < 100) {

                if (100 - porcentagemValor > parametros.inexequivel) {
                    statusSpan.textContent = "⚠ Preço inexequível (muito abaixo da média)";
                    statusSpan.style.color = "red";
                    input.classList.add("inex");
                }
                else {
                    statusSpan.textContent = "✔ Preço compatível com a média";
                    statusSpan.style.color = "green";
                    input.classList.add("ok");
                }

            }
            else {

                if (porcentagemValor - 100 > parametros.excessivo) {
                    statusSpan.textContent = "⚠ Preço excessivo (muito acima da média)";
                    statusSpan.style.color = "darkorange";
                    input.classList.add("exc");
                }
                else {
                    statusSpan.textContent = "✔ Preço compatível com a média";
                    statusSpan.style.color = "green";
                    input.classList.add("ok");
                }

            }

        });
    }

    function limparCampos() {

        // Limpa inputs e status
        inputsPrecos.forEach((input) => {

            input.value = "";

            // Remove classes de cor
            input.classList.remove("inex", "exc", "ok");

            // Limpa mensagem do span
            let statusSpan = input.nextElementSibling;
            statusSpan.textContent = "";
        });

        // Resetar resultados
        resultadoMedia.textContent = "R$ 0,00";
        resultadoVariacao.textContent = "0%";

    }

    btnCalcMed.addEventListener("click", function () {

        let media = calcularMedia();
        if (!media) return;

        let variacao = calcularVariacao();

        const salvo = localStorage.getItem("parametrosPrecos");

        let parametros = salvo
            ? JSON.parse(salvo)
            : { inexequivel: 15, excessivo: 15 };

        avaliarPrecos(media, parametros);

        resultadoMedia.textContent =
            "R$ " + media.toFixed(2).replace(".", ",");

        resultadoVariacao.textContent =
            variacao.toFixed(2).replace(".", ",") + "%";

    });

    btnLimpar.addEventListener("click", function () {
        limparCampos();
    });

});