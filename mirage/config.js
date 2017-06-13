import config from 'accountability-hack/config/environment';
import governments from 'accountability-hack/mirage/fixtures/governments';

export default function() {
    let url = `${config.apiHost}/${config.apiNamespace}`,
        url_governments = `${url}/governments`;

    this.get(url_governments, (schema, request) => {
        let limit = parseInt(request.queryParams.limit),
            results = governments;
        if (limit) {
            results = results.slice(0, limit);
        }
        return { objects: results };
    });

    this.passthrough('http://www.openspending.nl/api/v1/**');
}
