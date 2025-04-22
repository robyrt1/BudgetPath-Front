
const Installments = ({ debt, onClose }: any) => {
    // Calculando o valor das parcelas restantes
    const remainingInstallments = debt.installments - 1; // Considerando que a 1ª já foi paga
    const installmentValue = (debt.remainingAmount / remainingInstallments).toFixed(2);

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full">
                <h2 className="text-2xl font-semibold mb-4">Parcelas: {debt.description}</h2>

                {/* Exibindo as parcelas com Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {/* Parcela já paga */}
                    <div className="flex justify-between p-2 border border-gray-300 rounded-lg">
                        <span>Parcela 1 (Pago)</span>
                        <span>R$ {debt.paidAmount.toFixed(2)}</span>
                    </div>

                    {/* Parcelas restantes */}
                    {[...Array(remainingInstallments)].map((_, index) => (
                        <div
                            key={index}
                            className="flex justify-between p-2 border border-gray-300 rounded-lg"
                        >
                            <span>Parcela {index + 2}</span> {/* A partir da Parcela 2 */}
                            <span>R$ {installmentValue}</span>
                        </div>
                    ))}
                </div>

                <button
                    className="mt-4 text-red-500 hover:underline"
                    onClick={onClose} // Fechando as parcelas
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default Installments;
