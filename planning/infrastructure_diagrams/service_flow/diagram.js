const serviceFlow = `
    flowchart LR

    subgraph user
        HAPPY[😊]
        SAD[😭]
    end

    AUTH_KEY[Auth input]
    
    subgraph upload_file
        subgraph upload_ready
        end
        
        subgraph upload_working
        end

        subgraph upload_failed
        end

        subgraph upload_succeeded
        end

        upload_ready --> upload_working
        
        upload_working -- unauthorized --> upload_failed
        upload_working -- failure --> upload_failed
        upload_working -- aborted --> upload_failed

        upload_failed --> upload_working
        upload_failed ~~~ upload_succeeded

        upload_working --> upload_succeeded

        upload_succeeded --> upload_ready
    end

    upload_failed -.- SAD
    upload_succeeded -.- HAPPY

    subgraph mark_story
        subgraph mark_ready
        end
        
        subgraph mark_working
        end
        
        subgraph mark_failed
        end
        
        subgraph mark_succeeded
        end

        mark_ready --> mark_working

        mark_working -- unauthorized --> mark_failed
        mark_working -- failure --> mark_failed
        mark_working -- aborted --> mark_failed

        mark_failed --> mark_working
        mark_failed ~~~ mark_succeeded

        mark_working --> mark_succeeded

        mark_succeeded --> mark_ready
    end

    mark_failed -.- SAD
    mark_succeeded -.- HAPPY

    AUTH_KEY ~~~ upload_ready & mark_ready
    AUTH_KEY -- get --> upload_working & mark_working

`

export default serviceFlow
