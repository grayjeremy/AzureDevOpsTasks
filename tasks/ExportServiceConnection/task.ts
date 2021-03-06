import { each } from 'lodash';
import {
    getEndpointAuthorization,
    getEndpointUrl,
    getInput,
    getPathInput,
    getVariable,
    setVariable,
} from 'vsts-task-lib/task';
import { Task } from './util/Task';
import { VariableHelper } from './util/VariableHelper';

class ExportServiceConnection extends Task {
    protected async run() {
        const endpointName = getPathInput('name', true);
        const prefix = getInput('prefix', false) || endpointName;

        const endpointUrl = getEndpointUrl(endpointName, true);
        const endpointAuthorization = getEndpointAuthorization(endpointName, true);

        if (endpointUrl) {
            const variableName = `${prefix}.Url`;
            setVariable(variableName, endpointUrl);
            console.log(`${variableName}: ${endpointUrl}`);
        }
        if (endpointAuthorization) {
            if (endpointAuthorization.scheme) {
                const variableName = `${prefix}.Authorization.Scheme`;
                setVariable(variableName, endpointAuthorization.scheme);
                console.log(`${variableName}: ${endpointAuthorization.scheme}`);
            }
            if (endpointAuthorization.parameters) {
                each(endpointAuthorization.parameters, (value, key) => {
                    const variableName = `${prefix}.Authorization.${key}`;
                    setVariable(variableName, value, true);
                    console.log(`${variableName}: ${value}`);
                });
            }
        }
    }
}

new ExportServiceConnection(new VariableHelper(getVariable)).start();
