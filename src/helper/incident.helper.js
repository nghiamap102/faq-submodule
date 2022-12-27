export class IncidentHelper
{
    static handleCommonFunc(funcName, incident, item)
    {
        console.log(`handleCommonFunc - ${funcName}`);
    }

    static handleInitCommonFunc = (initFuncName, incident, item) =>
    {
        console.log(`state: ${JSON.stringify(this.state)}`);
        console.log(`handleInitCommonFunc (call default function): ${initFuncName}`);
    };
}
