import { Lisenter } from "./plugins/lib/listenAPI.js";

function randomBoolean() {
    return Boolean(Math.round(Math.random()));
}

Lisenter.on("FakePlayer", "template", "onDummySimulationOperation", (result) => {
    // logger.info(result);
    return randomBoolean();
});

Lisenter.on("FakePlayer", "template", "onDummyLookPos", (result) => {
    logger.info(result);
});
