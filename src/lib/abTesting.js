import { Probability } from "./probability";
import log from "./log";

const STORAGE_KEY = "cpex_cmp_variant";

// { id: 'A', probability: '30%', configUrl: 'https://cdn-src.cpex.cz/cmp/config-vatiant-A.json' }

export const mapVariants = variants => {
	const mapped = variants.map(({ probability, configUrl, id }) => ({
		p: probability,
		f() {
			return { id, configUrl, probability };
		}
	}));
	return mapped;
};

export const pickVariant = (variants = []) => {
	const variantId = getVariantId();
	if (variantId != null) {
		log.info(`Using previously selected variantId: ${variantId}`);
		const variant = findVariantById(variantId, variants);
		log.info("Variant picked", variant);
		return variant;
	}

	const probabilitilized = Probability(mapVariants(variants));
	const variant = probabilitilized();
	log.info("Variant picked", variant);

	saveVariantId(variant.id);
	return variant;
};

const findVariantById = (id, variants) => {
	return variants.find(variant => variant.id === id);
};

export const getVariantId = () => {
	return localStorage.getItem(STORAGE_KEY);
};

export const saveVariantId = variantId => {
	log.info(`Saving variantId: ${variantId}`);

	localStorage.setItem(STORAGE_KEY, variantId);
};
