function calcularFolha() {
	const nome = document.getElementById("nome").value;
	const salarioBruto = parseFloat(document.getElementById("salario").value);
	const dependentes = parseInt(document.getElementById("dependentes").value);
	const horasExtras =
		parseFloat(document.getElementById("horas-extras").value) || 0;
	const valeTransporte =
		parseFloat(document.getElementById("vale-transporte").value) || 0;
	const planoSaude =
		parseFloat(document.getElementById("plano-saude").value) || 0;

	if (!salarioBruto || salarioBruto <= 0) {
		alert("Insira um salário bruto válido.");
		return;
	}

	// Cálculo do INSS 2025
	const faixasINSS = [
		{ limite: 1518.0, aliquota: 0.075 },
		{ limite: 2793.88, aliquota: 0.09 },
		{ limite: 4190.83, aliquota: 0.12 },
		{ limite: 8157.41, aliquota: 0.14 },
	];

	let inss = 0;
	let salarioRestante = salarioBruto;
	let tetoINSS = 0;

	for (let i = 0; i < faixasINSS.length; i++) {
		if (salarioRestante > faixasINSS[i].limite) {
			inss += faixasINSS[i].limite * faixasINSS[i].aliquota;
		} else {
			inss += salarioRestante * faixasINSS[i].aliquota;
			break;
		}
		salarioRestante -= faixasINSS[i].limite;
	}

	tetoINSS = inss > 950.66 ? 950.66 : inss;

	// Cálculo do IRRF
	const deducaoDependente = 189.59;
	let baseIRRF = salarioBruto - tetoINSS - dependentes * deducaoDependente;
	const faixasIRRF = [
		{ limite: 2259.2, aliquota: 0.0, deducao: 0.0 },
		{ limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
		{ limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
		{ limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
		{ limite: Infinity, aliquota: 0.275, deducao: 896.0 },
	];

	let irrf = 0;
	for (let i = 0; i < faixasIRRF.length; i++) {
		if (baseIRRF > faixasIRRF[i].limite) continue;
		irrf = baseIRRF * faixasIRRF[i].aliquota - faixasIRRF[i].deducao;
		break;
	}
	irrf = irrf > 0 ? irrf : 0;

	// Cálculo das horas extras (50%)
	let valorHora = salarioBruto / 220;
	let extraTotal = horasExtras * valorHora * 1.5;

	// Cálculo do salário líquido
	let salarioLiquido =
		salarioBruto + extraTotal - tetoINSS - irrf - valeTransporte - planoSaude;

	// Exibição dos resultados
	document.getElementById("res-bruto").textContent =
		`R$ ${salarioBruto.toFixed(2)}`;
	document.getElementById("res-horas-extras").textContent =
		`R$ ${extraTotal.toFixed(2)}`;
	document.getElementById("res-inss").textContent = `R$ ${tetoINSS.toFixed(2)}`;
	document.getElementById("res-irrf").textContent = `R$ ${irrf.toFixed(2)}`;
	document.getElementById("res-vt").textContent =
		`R$ ${valeTransporte.toFixed(2)}`;
	document.getElementById("res-plano-saude").textContent =
		`R$ ${planoSaude.toFixed(2)}`;
	document.getElementById("res-dependentes").textContent =
		`R$ ${(dependentes * deducaoDependente).toFixed(2)}`;
	document.getElementById("res-liquido").textContent =
		`R$ ${salarioLiquido.toFixed(2)}`;

	document.getElementById("results").style.display = "block";
}
