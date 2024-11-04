function createTransaction(customerId, customerName, guid, date, invoiceDiscount, invoicePpn, subTotal, storeId, details) {
    if (!guid || guid.length !== 16) {
        throw new Error('GUID harus unik dan terdiri dari 16 digit.');
    }

    const transaction = {
        customerId: customerId,
        customer: customerName || null, 
        guid: guid,
        date: date,
        invoiceDiscount: invoiceDiscount,
        invoicePpn: invoicePpn,
        subTotal: subTotal,
        storeId: storeId,
        details: details.map(detail => {
            if (!detail.productGuid || !detail.transactionGuid) {
                throw new Error('Product GUID dan Transaction GUID harus ada di detail.');
            }
            return {
                productGuid: detail.productGuid,
                transactionGuid: guid, 
                productName: detail.productName,
                qty: detail.qty,
                price: detail.price,
                discount: detail.discount,
                ppn: detail.ppn,
                totalPrice: detail.totalPrice
            };
        })
    };

    return transaction;
}

export { createTransaction };
