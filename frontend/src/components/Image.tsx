import React, { useState, useEffect, useRef } from 'react'

interface Props {
    fileName?: string
    blob: Blob
}


const Image: React.FC<Props> = (props) => {
    const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>()
    const imgRef = useRef<HTMLImageElement | null>(null)
    const [load, setLoad] = useState(true)
    useEffect(() => {

        if (props.blob) {
            const reader: FileReader = new FileReader()
            reader.readAsDataURL(props.blob)
            reader.onloadend = () => {
                setImageSrc(reader.result)
            }
        }

    }, [props.blob])

    function deleteImage() {

        setLoad(prev => prev = !prev)
    }

    {
        if (typeof imageSrc == 'string') {
            return (
                <>
                    <img ref={imgRef} style={load ? { display: 'relative' } : { display: 'none' }} src={imageSrc} alt={props.fileName} />
                    <i style={load ? { display: 'relative' } : { display: 'none' }} onClick={deleteImage} className="far fa-trash-alt"></i>
                </>
            )

        }
        else {
            return <h1>Image didn't upload</h1>
        }
    }



}

export default Image
