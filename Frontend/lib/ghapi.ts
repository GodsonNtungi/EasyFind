import {Octokit} from "octokit";
import * as sodium  from "libsodium-wrappers";

const GH_TOKEN = `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`
const GH_USER = 'oceanware'
const GH_REPO = 'mchongotz-eshop'

const octokit = new Octokit({ auth: GH_TOKEN});


async function getRepoPubKey() {

    return await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: GH_USER,
        repo: GH_REPO
    })

}

export async function encrypt(secret: any, key: string) {

    // wait for sodium to be ready
    await sodium.ready

    // Convert Secret & Base64 key to Uint8Array.
    let binkey = sodium.from_base64(key , sodium.base64_variants.ORIGINAL)
    let binsec = sodium.from_string(secret)
    //Encrypt the secret using LibSodium
    let encBytes = sodium.crypto_box_seal(binsec, binkey)

    // Convert encrypted Uint8Array to Base64
    return sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)

}

export async function createOrUpdateRepoSecret(name: string, value: string) {

    const {data} = await getRepoPubKey()

    const en_value = await encrypt(value, data.key)

    return await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: GH_USER,
        repo: GH_REPO,
        secret_name: name,
        encrypted_value: en_value,
        key_id: data.key_id
    })
}

export async function createRepoWorkFlowDispatch(
    image_tag: string,
    hostname: string,
    domain_name: string,
    backend_secret: string
) {
    return await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
        owner: GH_USER,
        repo: GH_REPO,
        workflow_id: 'infra.yml',
        ref: 'main',
        inputs: {
            IMAGE_TAG: image_tag,
            HOSTNAME: hostname,
            TARGET_HOST: 'oceanwareltd.co.tz',
            DOMAIN_NAME: domain_name,
            BACKEND_SECRET: backend_secret
        }
    })
}
