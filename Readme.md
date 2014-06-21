# JSON API Calls

    curl http://surf.flow.lp.lw.loc/api/projects | jq '.'
    curl http://surf.flow.lp.lw.loc/api/serverCollections | jq '.'
    curl http://surf.flow.lp.lw.loc/api/branches?projectId=17 | jq '.'
    curl http://surf.flow.lp.lw.loc/api/tags?projectId=17 | jq '.'