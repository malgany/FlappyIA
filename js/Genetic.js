function Genetic() {

    this.criaGenomas = criaGenomas;
    this.activateNetwork = activateNetwork;
    this.crossover = crossover;
    this.executeGenome = executeGenome;

    /*
    * cria se necessário
    */
    function criaGenomas(num_con, inputs, outputs) {
        var pool = 10, connections = 15, gates = 5;
        while(genomas.length < num_con) {
            var g = new Architect.Liquid(inputs, pool, outputs, connections, gates);
            g.fitness = 0;
            genomas.push(g);
        }
    }

    function activateNetwork(network, input) {

        if(input == undefined) {
            network.fitness = 0;
            input = [0, 0, 0];
        }

        return network.activate(input);
    }

    function crossover() {

        genomas = selectBestGenomes(5);

        var bestGenomes = _.clone(genomas);

        // crossover de apenas 1/4
        while (genomas.length < (numero_genomas-Math.round(numero_genomas/2))) {
            var genA = _.sample(bestGenomes).toJSON();
            var genB = _.sample(bestGenomes).toJSON();

            // Cross over and Mutate
            var newGenome = mutate(crossOver(genA, genB));

            genomas.push(Network.fromJSON(newGenome));
        }

        while (genomas.length < numero_genomas) {
            // Get two random Genomes
            var gen = _.sample(bestGenomes).toJSON();

            // Mutate
            var newGenome = mutate(gen);

            // Add to generation
            genomas.push(Network.fromJSON(newGenome));
        }
    }

    function selectBestGenomes(selectN) {

        var selected = _.sortBy(genomas, 'fitness').reverse();

        while (selected.length > selectN) {
            selected.pop();
        }

        return selected;
    }

    function crossOver(netA, netB) {
        // Swap (50% prob.)
        if (Math.random() > 0.5) {
            var tmp = netA;
            netA = netB;
            netB = tmp;
        }

        // Clone network
        netA = _.cloneDeep(netA);
        netB = _.cloneDeep(netB);

        // Cross over data keys
        crossOverDataKey(netA.neurons, netB.neurons, 'bias');

        return netA;
    }

    function crossOverDataKey(a, b, key) {
        var cutLocation = Math.round(a.length * Math.random());

        var tmp;
        for (var k = cutLocation; k < a.length; k++) {
            // Swap
            tmp = a[k][key];
            a[k][key] = b[k][key];
            b[k][key] = tmp;
        }
    }

    function mutate(net){

        mutateDataKeys(net.neurons, 'bias', 0.3);

        mutateDataKeys(net.connections, 'weight', 0.3);

        return net;
    }

    function mutateDataKeys(a, key, mutationRate){
        for (var k = 0; k < a.length; k++) {

            if (Math.random() > mutationRate) {
                continue;
            }

            a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
        }
    }
	
	function executeGenome(pos, co) {
		if(genomas[pos].fitness == undefined || genomas[pos].fitness < myscore.score) {
			genomas[pos].fitness = myscore.score;
		}
		
		if(myscore.score > record_fitness) {
			record_fitness = myscore.score;
		}
		
		if(co) {
			crossover();
			geracao++;
		}
	}
}