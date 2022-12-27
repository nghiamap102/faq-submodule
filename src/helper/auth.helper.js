import Cookies from 'js-cookie';

export class AuthHelper
{
    static getVDMSToken()
    {
        // Get from cookie or login
        return Cookies.get('vdmsAccesstoken') || Cookies.get('vdmsPublicAccesstoken') || Cookies.get('access_token');
    }

    static getVDMSHeader()
    {
        // Get from cookie or login
        if (AuthHelper.getVDMSToken())
        {
            return {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${AuthHelper.getVDMSToken()}`,
            };
        }
        else
        {
            return null;
        }
    }

    static getVDMSHeaderAuthOnly()
    {
        return {
            'Authorization': `bearer ${AuthHelper.getVDMSToken()}`,
        };
    }

    static getCameraSnapShotImageHeader()
    {
        // Get from cookie or login
        return {
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Authorization': '177108205230035101188016045114077045061024146033131140046143048096155073214202213207150017064172145192161087243173120162049223244198167161177149216085136202202125042015214015138075111160060122184119054199231250202095148169235173071097188247227063044160120151192066151055006208056122124100241203186194027128130130170116250121185144004098058075018009236095018034161170185107215172165126197198169098008186224014212195085064120134037224255227215017147103189147040244140186121084096031149101087039170027240075066237195100167129089141096144072148206235112124092212104202159019031016026032067196179236035221101186089150038240119083044158007205223106095033023230041165039001053159127079037038149105139007148145089119131086180071139187181034146119136058095162226084201095238071166153245161169120223086104045040009013026209238',
        };
    }

    static getSystemHeader()
    {
        return {
            'Content-Type': 'application/json',
        };
    }
}
