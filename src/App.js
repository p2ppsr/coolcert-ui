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

import sdk from '@babbage/sdk'

const isStaging = true || Boolean(process.env.REACT_APP_IS_STAGING)

const useStyles = makeStyles(style, {
  name: 'CoolCert'
})
export default () => {
  const classes = useStyles()
  const [serverURL, setServerURL] = useState(
    //window.location.host.startsWith('localhost')
    //  ? 'http://localhost:3002'
    //  :
       isStaging
        ? 'https://staging-coolcert.babbage.systems'
        : 'https://byte-shop.babbage.systems'
  )
  const [results, setResults] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleGetCert = async e => {
    console.log("handling get cert")
    e.preventDefault()
    setLoading(true)
    try {
      var r = await sdk.getCertificates({
        // Specify the types of certificates to request...
        // Here, we are requesting a "Cool Person Certificate"
        types: ['AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo='],
        // Provide a list of certifiers you trust. Here, we are trusting
        // CoolCert, the CA that issues Cool Person Certificates.
        certifiers: ['0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8']
      })
      console.log('r=', r)
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
