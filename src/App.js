import React, { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  LinearProgress
} from '@material-ui/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import style from './style'
import { makeStyles } from '@material-ui/core/styles'
import { invoice, pay } from './utils'
import GetCertIcon from '@material-ui/icons/GetApp'

import { getCertificates, createCertificate } from '@babbage/sdk'

const useStyles = makeStyles(style, {
  name: 'CoolCert'
})
export default () => {
  const classes = useStyles()
  //const [serverURL, setServerURL] = useState('http://localhost:3002')
  //const [serverURL, setServerURL] = useState('https://coolcert.babbage.systems')
  const [serverURL, setServerURL] = useState('https://staging-coolcert.babbage.systems')
  const [results, setResults] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleGetCert = async e => {
    console.log("handling get cert")
    e.preventDefault()
    setLoading(true)
    try {
      let certificates = await getCertificates({
        // Specify the types of certificates to request...
        // Here, we are requesting a "Cool Person Certificate"
        types: {'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo=': ['cool']},
        // Provide a list of certifiers you trust. Here, we are trusting
        // CoolCert, the CA that issues Cool Person Certificates.
        certifiers: ['0447431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f890b13455f0b59c7b75897033e7ae260834a2397e7c316a0fd21e35e8d81ddd34']
//        certifiers: ['0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8']
      })
      //if (typeof certificates === 'object') certificates = certificates.certificates
      console.log('certificates=', certificates)
      if (certificates.length === 0) {
        // Don't have a certificate yet. Request a new one.
        const certificate = await createCertificate({
          certificateType: 'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo=',
          fieldObject: { cool: 'true' },
          certifierUrl: serverURL,
          certifierPublicKey: '0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8'
        })
        console.log(certificate)
      } else {
        // We appear to already have one.
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
      setUploadProgress(0)
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
        <form onSubmit={handleGetCert}>
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
          <br />
          <center className={classes.broadcast_wrap}>
            <Button
              onClick={handleGetCert}
              variant='contained'
              color='primary'
              size='large'
              type='submit'
              disabled={loading}
              startIcon={<GetCertIcon />}
            >
              Get Cool Certificate
            </Button>
            <br />
            <br />
            {loading && (
              <LinearProgress
                variant={uploadProgress === 0 ? 'indeterminate' : 'determinate'}
                value={uploadProgress === 0 ? undefined : uploadProgress}
              />
            )}
            {results && (
              <div>
                <Typography variant='h4'>Success!</Typography>
              </div>
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
