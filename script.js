// Constantes atualizadas para 2025
const TETO_INSS = 8157.41;
const SALARIO_MINIMO = 1518.0;
const DEDUCAO_DEPENDENTE = 189.59;

function formatarMoeda(valor) {
	return valor.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
		minimumFractionDigits: 2,
	});
}

function calcularINSS(salario) {
	let inss = 0;

	// Novas faixas do INSS 2025
	if (salario <= SALARIO_MINIMO) {
		inss = salario * 0.075;
	} else if (salario <= 2793.88) {
		inss = SALARIO_MINIMO * 0.075 + (salario - SALARIO_MINIMO) * 0.09;
	} else if (salario <= 4190.83) {
		inss =
			SALARIO_MINIMO * 0.075 +
			(2793.88 - SALARIO_MINIMO) * 0.09 +
			(salario - 2793.88) * 0.12;
	} else if (salario <= TETO_INSS) {
		inss =
			SALARIO_MINIMO * 0.075 +
			(2793.88 - SALARIO_MINIMO) * 0.09 +
			(4190.83 - 2793.88) * 0.12 +
			(salario - 4190.83) * 0.14;
	} else {
		inss =
			SALARIO_MINIMO * 0.075 +
			(2793.88 - SALARIO_MINIMO) * 0.09 +
			(4190.83 - 2793.88) * 0.12 +
			(TETO_INSS - 4190.83) * 0.14;
	}

	return Number(inss.toFixed(2));
}

function calcularIRRF(baseCalculo, dependentes) {
	const base = baseCalculo - dependentes * DEDUCAO_DEPENDENTE;

	// Tabela IRRF atual (verificar atualizações anuais)
	if (base <= 2112) return 0;
	if (base <= 2826.65) return base * 0.075 - 158.4;
	if (base <= 3751.05) return base * 0.15 - 370.4;
	if (base <= 4664.68) return base * 0.225 - 651.73;
	return base * 0.275 - 884.96;
}

function validarCampos() {
	let valido = true;
	const nome = document.getElementById("nome").value;
	const salario = document.getElementById("salario").value;

	if (nome.trim() === "") {
		document.getElementById("nome").classList.add("error");
		document.getElementById("nome-error").style.display = "block";
		valido = false;
	} else {
		document.getElementById("nome").classList.remove("error");
		document.getElementById("nome-error").style.display = "none";
	}

	if (salario <= 0 || isNaN(salario)) {
		document.getElementById("salario").classList.add("error");
		document.getElementById("salario-error").style.display = "block";
		valido = false;
	} else {
		document.getElementById("salario").classList.remove("error");
		document.getElementById("salario-error").style.display = "none";
	}

	return valido;
}

function calcularFolha() {
	if (!validarCampos()) return;

	const dados = {
		nome: document.getElementById("nome").value,
		salarioBruto: parseFloat(document.getElementById("salario").value),
		dependentes: parseInt(document.getElementById("dependentes").value),
		horasExtras: parseInt(document.getElementById("horas-extras").value),
		valeTransporte: parseFloat(
			document.getElementById("vale-transporte").value,
		),
		planoSaude: parseFloat(document.getElementById("plano-saude").value),
	};

	// Cálculo das horas extras (50% adicional)
	const valorHora = dados.salarioBruto / 220;
	const valorHorasExtras = dados.horasExtras * valorHora * 1.5;

	// Cálculos oficiais
	const inss = calcularINSS(dados.salarioBruto);
	const baseIRRF = dados.salarioBruto - inss;
	const irrf = calcularIRRF(baseIRRF, dados.dependentes);

	// Total de descontos
	const totalDescontos = inss + irrf + dados.valeTransporte + dados.planoSaude;

	// Salário líquido
	const salarioLiquido = dados.salarioBruto + valorHorasExtras - totalDescontos;

	// Exibir resultados
	document.getElementById("results").style.display = "block";
	document.getElementById("res-bruto").textContent = formatarMoeda(
		dados.salarioBruto,
	);
	document.getElementById("res-horas-extras").textContent =
		formatarMoeda(valorHorasExtras);
	document.getElementById("res-inss").textContent = formatarMoeda(inss);
	document.getElementById("res-irrf").textContent = formatarMoeda(irrf);
	document.getElementById("res-vt").textContent = formatarMoeda(
		dados.valeTransporte,
	);
	document.getElementById("res-plano-saude").textContent = formatarMoeda(
		dados.planoSaude,
	);
	document.getElementById("res-dependentes").textContent = formatarMoeda(
		dados.dependentes * DEDUCAO_DEPENDENTE,
	);
	document.getElementById("res-liquido").textContent =
		formatarMoeda(salarioLiquido);
}
