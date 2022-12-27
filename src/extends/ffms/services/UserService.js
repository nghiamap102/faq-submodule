import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class UserService
{
    http = new HttpClient();
    apiURL = AppConstant.vdms.url;
    authURL = '/api/auth';

    constructor(contexts)
    {
        this.contexts = contexts || {};
    }

    getUser = (userName) =>
    {
        return this.http.get(`/api/vdms-api/v1/users/${userName}`, AuthHelper.getVDMSHeader());
    };

    getUsers = () =>
    {
        return this.http.get('/api/vdms-api/v1/users', AuthHelper.getVDMSHeader());
    }

    queryUserInPath = (userName, path, skip, take) =>
    {
        const dataRq = {
            ...userName &&
            {
                isExact: false,
                name: userName,
            },
            skip: skip || 0,
            take: take || 10,
            path: path,
            type: 'user',
        };
        const searchQuery = new URLSearchParams(dataRq).toString();
        return this.http.get(`/api/vdms-api/v1/group/query?${searchQuery}`, AuthHelper.getVDMSHeader());

    }

    createUser = (userObj) =>
    {
        return this.http.post('/api/vdms-api/v2/user', userObj, AuthHelper.getVDMSHeader());
    };

    // Approve user
    approveUser = (userName, userObj = {}) =>
    {
        return this.http.post(`/api/vdms-api/v2/user/approve?userName=${userName}`, userObj, AuthHelper.getVDMSHeader());
    };

    // lock user
    lockUser = (userName, userObj = {}) =>
    {
        return this.http.post(`/api/vdms-api/v2/user/lock?userName=${userName}`, userObj, AuthHelper.getVDMSHeader());
    };

    // lock user
    unlockUser = (userName, userObj = {}) =>
    {
        return this.http.post(`/api/vdms-api/v2/user/unlock?userName=${userName}`, userObj, AuthHelper.getVDMSHeader());
    };

    // Change password
    changePassword = (passInfo) =>
    {
        return this.http.post('/api/vdms-api/v2/user/me/password', passInfo, AuthHelper.getVDMSHeader());
    };

    // Reset password
    resetPassword = (userObj) =>
    {
        return this.http.post('/api/vdms-api/v2/user/admin/resetpassword', userObj, AuthHelper.getVDMSHeader());
    };

    insertInviteCode = async (data) =>
    {
        if (!data)
        {
            return false;
        }

        return this.http.post('/api/ffms/systemTokens/insert', { inviteCode: data }, AuthHelper.getVDMSHeader());
      
    }

    getInviteCode = async (code) =>
    {
        if (!code)
        {
            return false;
        }

        const res = await this.http.get(`/api/systemTokens/info/${code}`, AuthHelper.getVDMSHeader());
        if (res && res.result !== 0)
        {
            return false;
        }

        return res.data;
    }

    getInviteLink = (id) =>
    {
        return this.http.get(`/api/systemTokens/getInviteLink/${id}`, AuthHelper.getVDMSHeader());
    }

    checkInviteCode = async (inviteCode) =>
    {
        if (!inviteCode)
        {
            return false;
        }

        const res = await this.http.post('/api/ffms/validate-code', { inviteCode }, AuthHelper.getVDMSHeader());
        if (res && res.result !== 0)
        {
            return res.message;
        }

        return res.data;
    };

    registerUserByInviteCode = (inviteCode, data) =>
    {
        const userObj = {
            Email: data.email,
            UserName: data.username,
            Password: data.password,
        };
        return this.http.post('/api/ffms/register', { inviteCode, userObj });
    };

    checkIfUserExistsByUserName = (userName) =>
    {
        return this.http.get(`${this.authURL}/api/v1/users/${userName}`, AuthHelper.getVDMSHeader()).then((res) =>
        {
            return res.data;
        });
    };

    checkIfUserExistsByEmail = (email) =>
    {
        return this.http.get(`${this.authURL}/api/v1/users/email/${email}`, AuthHelper.getVDMSHeader()).then((res) =>
        {
            return res.data;
        });
    };

    checkIfUserNameExistsByInviteCode = (inviteCode, userName) =>
    {
        return this.http.post('/api/ffms/systemTokens/validate-account', { inviteCode, userName }).then((res) =>
        {
            if (res.result !== 0)
            {
                if (this.contexts?.modal)
                {
                    this.contexts.modal.toast({ type: 'error', message: res.message });
                }
                return true;
            }
            return res.data;
        });
    };

    checkIfEmailExistsByInviteCode = (inviteCode, email) =>
    {
        return this.http.post('/api/ffms/systemTokens/validate-account', { inviteCode, email }).then((res) =>
        {
            if (res.result !== 0)
            {
                if (this.contexts?.modal)
                {
                    this.contexts.modal.toast({ type: 'error', message: res.message });
                }
                return true;
            }
            return res.data;
        });
    };

    addUsersToGroup = (groupPath, userNames) =>
    {
        if (userNames && userNames.length)
        {
            const data = {
                'groupPath': groupPath || '/root/ims/vbd/users',
                'userNames': userNames,
                'memberPaths': [],
            };
            return this.http.post('/api/vdms-api/v1/group/user', data, AuthHelper.getVDMSHeader());
        }
        return Promise.resolve(null);
    };

    authorizePassword = (userName, password) =>
    {
        return this.http.post(`${this.authURL}/oauth/token`, { userName, password }, AuthHelper.getVDMSHeader()).then((res) =>
        {
            return res && res.access_token ? true : res;
        });
    };
}
