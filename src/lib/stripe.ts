import Stipe from "stripe";
import config from "../config";

const stripe = new Stipe(config.stripe_secret_key as string);

export default stripe;
