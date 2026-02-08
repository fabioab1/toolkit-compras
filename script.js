document.addEventListener('DOMContentLoaded', function () {

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

    function calcularVaricao() {

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

    btnCalcMed.addEventListener('click', function() {

        let media = calcularMedia();
        let variacao = calcularVaricao();

        console.log("Média:", media.toFixed(2));
        console.log("Variação:", variacao.toFixed(2) + "%");

    });

})