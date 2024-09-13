class RecintosZoo {
  analisaRecintos(animal, quantidade) {
    const animaisPermitidos = {
      'LEAO': { tamanho: 3, bioma: 'savana', carnivoro: true },
      'LEOPARDO': { tamanho: 2, bioma: 'savana', carnivoro: true },
      'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
      'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
      'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
      'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
    };

    if (!animaisPermitidos[animal]) {
      return { erro: 'Animal inválido' };
    }

    if (quantidade <= 0 || !Number.isInteger(quantidade)) {
      return { erro: 'Quantidade inválida' };
    }

    const animalInfo = animaisPermitidos[animal];
    let recintosViaveis = recintos
      .filter(recinto => this.recintoViavel(recinto, animalInfo, quantidade, animaisPermitidos))
      .map(recinto => this.formatarRecinto(recinto, animalInfo, quantidade, animaisPermitidos));

    if (recintosViaveis.length === 0 && animal === 'MACACO' && quantidade > 1) {
      const recintosSavana = recintos.filter(r => r.bioma.includes('savana'));
      const recintosFloresta = recintos.filter(r => r.bioma.includes('floresta'));

      const recintosViaveisSavana = recintosSavana
        .filter(recinto => this.recintoViavel(recinto, animalInfo, 1, animaisPermitidos))
        .map(recinto => this.formatarRecinto(recinto, animalInfo, 1, animaisPermitidos));
      const recintosViaveisFloresta = recintosFloresta
        .filter(recinto => this.recintoViavel(recinto, animalInfo, 1, animaisPermitidos))
        .map(recinto => this.formatarRecinto(recinto, animalInfo, 1, animaisPermitidos));

      if (recintosViaveisSavana.length > 0 && recintosViaveisFloresta.length > 0) {
        recintosViaveis = [...recintosViaveisSavana, ...recintosViaveisFloresta];
      }
    }

    if (recintosViaveis.length === 0) {
      return { erro: 'Não há recinto viável' };
    }

    return { recintosViaveis };
  }

  recintoViavel(recinto, animalInfo, quantidade, animaisPermitidos) {
    const espacoOcupadoAtual = recinto.animais.reduce((total, especie) => total + animaisPermitidos[especie].tamanho, 0);
    const diferentesEspecies = new Set(recinto.animais).size > 1;
    const espacoExtra = diferentesEspecies ? 1 : 0;
    const espacoNecessario = animalInfo.tamanho * quantidade;
    const espacoRestante = recinto.tamanhoTotal - (espacoOcupadoAtual + espacoExtra + espacoNecessario);

    if (!animalInfo.bioma.includes(recinto.bioma)) return false;
    if (animalInfo.carnivoro && recinto.animais.length > 0 && !recinto.animais.every(especie => especie === animal)) {
      return false;
    }
    if (animalInfo.bioma.includes('savana') && !recinto.bioma.includes('savana') ||
        animalInfo.bioma.includes('rio') && !recinto.bioma.includes('rio')) {
      return false;
    }
    if (animalInfo.especie === 'MACACO' && recinto.animais.length === 0) {
      return false;
    }

    return espacoRestante >= 0;
  }

  formatarRecinto(recinto, animalInfo, quantidade, animaisPermitidos) {
    const espacoOcupadoAtual = recinto.animais.reduce((total, especie) => total + animaisPermitidos[especie].tamanho, 0);
    const diferentesEspecies = new Set(recinto.animais).size > 1;
    const espacoExtra = diferentesEspecies ? 1 : 0;
    const espacoNecessario = animalInfo.tamanho * quantidade;
    const espacoRestante = recinto.tamanhoTotal - (espacoOcupadoAtual + espacoExtra + espacoNecessario);

    return `Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`;
  }
}

const recintos = [
  { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: ['MACACO', 'MACACO', 'MACACO'] },
  { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
  { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: ['GAZELA'] },
  { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
  { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: ['LEAO'] }
];

export { RecintosZoo as RecintosZoo };
