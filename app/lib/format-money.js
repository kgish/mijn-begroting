export default function(amount) {
    return accounting.formatMoney(amount, "€", 0, ".", ",", "%s %v");
}
