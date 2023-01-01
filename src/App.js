import React, { useState } from 'react'
import { TextField, Button, Typography } from '@material-ui/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import style from './style'
import { makeStyles } from '@material-ui/core/styles'

import GetCertIcon from '@material-ui/icons/GetApp'

import { getCertificates, createCertificate } from '@babbage/sdk'

const useStyles = makeStyles(style, { name: 'CoolCert' })

export default () => {
  const classes = useStyles()

  // Certificate type just needs to be unique, not secret or private.
  // 32 random bytes as base64 string is good.
  // This is the "standard" coolcert certificate type.
  const certificateType = 'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo='

  // Default server URL to interact with.
  let certifierServerURL
  // The public key of the certifier at that URL, must match actual public key.
  let certifierPublicKey

  const serverTarget = "staging" // "staging", "local", default is production

  switch (serverTarget) {
    case 'local':
      certifierServerURL = 'http://localhost:3002';
      certifierPublicKey = '02cab461076409998157f05bb90f07886380186fd3d88b99c549f21de4d2511b83';
      break;
    case 'staging':
      certifierServerURL = 'https://staging-coolcert.babbage.systems';
      certifierPublicKey = '0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8';
      break;
    case 'production':
    default:
      certifierServerURL = 'https://coolcert.babbage.systems';
      certifierPublicKey = '0220529dc803041a83f4357864a09c717daa24397cf2f3fc3a5745ae08d30924fd';
      break;
  }

  const [serverURL, setServerURL] = useState(certifierServerURL)
  const [loading, setLoading] = useState(false)
  const [certExists, setCertExists] = useState(false)
  const [result, setResult] = useState(null)

  const handleReset = async e => {
    setLoading(false)
    setCertExists(false)
    setResult(null)
  }

  const handleGetCert = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const typesAndFields =  {}
      // Here, we are requesting a "Cool Person Certificate" and the "cool" property of that certificate type.
      typesAndFields[certificateType] = ['cool']

      let certificates = await getCertificates({
        // Specify the types of certificates to request and the fields of interest...
        types: typesAndFields,
        // Provide a list of certifiers you trust. Here, we are trusting
        // CoolCert, the CA that issues Cool Person Certificates.
        certifiers: [certifierPublicKey]
      })
      if (certificates.length === 0) {
        // Don't have a certificate yet. Request a new one.
        const certificate = await createCertificate({
          certificateType: certificateType,
          fieldObject: { cool: 'true' },
          certifierUrl: serverURL,
          certifierPublicKey: certifierPublicKey
        })
        setResult(certificate)
      } else {
        // We appear to already have one.
        setCertExists(true)
      }
    } catch (e) {
      console.error(e)
      if (e.response && e.response.data && e.response.data.description) {
        toast.error(e.response.data.description)
      } else {
        toast.error(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={classes.content_wrap}>
      <ToastContainer />
      <center>
        <Typography variant='h4'>CoolCert UI</Typography>
        <br />
        <br />
      </center>
      {true && (
        <form>
          <Typography variant='h5'>Server URL</Typography>
          <Typography paragraph>
            Enter the URL of the CoolCert server to interact with
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            label='Server URL'
            value={serverURL}
            onChange={e => setServerURL(e.target.value)}
          />
          <br />
          <br />
          <center className={classes.broadcast_wrap}>
            {!loading && !result && !certExists && (
            <Button
              onClick={handleGetCert}
              variant='contained'
              color='primary'
              size='large'
              disabled={loading}
              startIcon={<GetCertIcon />}
            >
              Get Cool Certificate
            </Button>
            )}
            <br />
            <br />
            {loading && (
              <div>
                <Typography variant='h4'>Requesting new CoolCert!</Typography>
              </div>
            )}
            {result && (
              <div>
                <Typography variant='h4'>Success!</Typography>
              </div>
            )}
            {certExists && (
              <div>
                <Typography variant='h4'>You already have one!</Typography>
              </div>
            )}
            {!loading && (result || certExists) && (
            <Button
              onClick={handleReset}
              variant='contained'
              color='primary'
              size='large'
            >
              Reset
            </Button>
            )}
          </center>
        </form>
      )}
      <br />
      <Typography align='center'>
        View the <a href='https://github.com/p2ppsr/coolcert-ui'>GitHub Repo</a> for this site
      </Typography>
      <br />
      <Typography align='center'>
        Made with <a href='https://projectbabbage.com'>www.ProjectBabbage.com</a> tools :)
      </Typography>
    </div>
  )
}
