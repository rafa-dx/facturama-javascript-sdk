/*
    Soporte API Facturama
    facturamasoporte@freshbooks.com 
*/

(function(window)
{
    const valuesFacturama = {
        useragent: "usuario",
        token: "token==",
        url: "https://apisandbox.facturama.mx"

    };

    async function fetchData(path, method = 'GET', data = null)
    {
        const url = new URL(path, valuesFacturama.url);
        const options = 
        {
            method: method,
            headers: 
            {
                'Content-Type': 'application/json',
                'User-Agent': valuesFacturama.useragent,
                'Authorization': 'Basic ' + valuesFacturama.token  
            },
            credentials: 'include' 
        };
        if(data)
        {
            options.body = JSON.stringify(data);
        }
        try
        {
            const response = await fetch(url.toString(), options);
            if(!response.ok)
            {
                throw new Error(`HTTP error! Status: ${response.status}`);    
            }

            return await response.json();
        }
        catch(error)
        {
            console.error('Fetch error', error);
            throw error;
        }
    }
    function facturama()
    {
        const facturamaObject = 
        {
            Clients:
            {
                Get:    (id)    => fetchData(`client/${id}`),
                List: (data = '') => fetchData(data ? `clients?${data}` : 'client'),
                Create: (data)  => fetchData('client', 'POST', data),
                Remove: (id)    => fetchData(`client/${id}`,'DELETE'),
                Update: (id, data) => fetchData(`client/${id}`,'PUT',data),
            },
            Products: 
            {
                Get: (id)   => fetchData(`product/${id}`),
                List: (data = '')    => fetchData(data ? `products?${data}` : 'product'),
                Create: (data)  => fetchData('product','POST', data),
                Remove: (id)    => fetchData(`product/${id}`,'DELETE'),
                Update: (id, data)    => fetchData(`product/${id}`,'PUT', data)
            },
            BranchOffice: {
                Get: (id) => fetchData(`branchOffice/${id}`),
                List: () => fetchData('branchOffice'),
                Create: (data) => fetchData('branchOffice', 'POST', data),
                Remove: (id) => fetchData(`branchOffice/${id}`, 'DELETE'),
                Update: (id, data) => fetchData(`branchOffice/${id}`, 'PUT', data)
            },
            
            Series: {
                List: (id) => fetchData(`serie/${id}`),
                Create: (idBranch, data) => fetchData(`serie/${idBranch}`, 'POST', data),
                Remove: (idBranch, name) => fetchData(`serie/${idBranch}/${name}`, 'DELETE'),
                Update: (idBranch, name, data) => fetchData(`serie/${idBranch}/${name}`, 'PUT', data)
            },
            Cfdi: {
                Get: (id) => fetchData(`cfdi/${id}`),
                List: (param) => fetchData(`cfdi?${param}`),
                Create3: (data) => fetchData('3/cfdis', 'POST', data),
                Send: (param) => fetchData(`cfdi`, 'POST', param),
                Cancel: (params) => fetchData(`cfdi/${params}`, 'DELETE'),
                Download: (format, type, id) => fetchData(`cfdi/${format}/${type}/${id}`),
                Acuse: (format, type, id) => fetchData(`acuse/${format}/${type}/${id}`),
                Status: (params) => fetchData(`cfdi/status?${params}`)
            },
            
            TaxEntity: {
                Get: () => fetchData('taxEntity'),
                Update: (data) => fetchData('taxEntity', 'PUT', data),
                UploadCsd: (data) => fetchData('taxEntity/UploadCsd', 'PUT', data),
                UploadImage: (data) => fetchData('taxEntity/UploadLogo', 'PUT', data)
            },
            SuscriptionPlan: {
                Get: () => fetchData('suscriptionPlan')
            },
            
            Catalogs: {
                States: (country) => fetchData(`catalogs/municipalities?countryCode=${country}`),
                Municipalities: (state) => fetchData(`catalogs/municipalities?stateCode=${state}`),
                Localities: (state) => fetchData(`catalogs/localities?stateCode=${state}`),
                Neighborhoods: (postalCode) => fetchData(`catalogs/neighborhoods?postalCode=${postalCode}`),
                ProductsOrServices: (keyword) => fetchData(`catalogs/ProductsOrServices?keyword=${keyword}`),
                PostalCodes: (keyword) => fetchData(`catalogs/PostalCodes?keyword=${keyword}`),
                Units: () => fetchData('catalogs/Units'),
                Currencies: () => fetchData('catalogs/Currencies'),
                Countries: () => fetchData('catalogs/Countries'),
                PaymentForms: () => fetchData('catalogs/PaymentForms'),
                PaymentMethods: () => fetchData('catalogs/PaymentMethods'),
                FederalTaxes: () => fetchData('catalogs/FederalTaxes'),
                FiscalRegimens: () => fetchData('catalogs/FiscalRegimens'),
                CfdiTypes: () => fetchData('catalogs/CfdiTypes'),
                RelationTypes: () => fetchData('catalogs/RelationTypes'),
                CfdiUses: (keyword) => fetchData(`catalogs/CfdiUses?keyword=${keyword}`)
            },
            
            customers: {
                validate: (data) => fetchData('api/customers/validate', 'POST', data)
            }
        };

        facturamaObject.getToken = function()
        {
            return "Basic " + valuesFacturama.token;
        }
        facturamaObject.getBaseUri = function()
        {
            return valuesFacturama.url;
        }
        return facturamaObject;

    }
    if(window.Facturama === undefined)
    {
        window.Facturama = facturama();
    }
})(window)