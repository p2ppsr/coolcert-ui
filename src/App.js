import React, { useState } from 'react'
import { TextField, Button, Typography } from '@material-ui/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import style from './style'
import { makeStyles } from '@material-ui/core/styles'

import GetCertIcon from '@material-ui/icons/GetApp'

import { getCertificates, createCertificate } from '@babbage/sdk'

const useStyles = makeStyles(style, { name: 'Myac' })

export default () => {
  const classes = useStyles()

  const certifierPublicKeyCompressed = '025384871bedffb233fdb0b4899285d73d0f0a2b9ad18062a062c01c8bdb2f720a'
  const certifierPublicKey = '045384871bedffb233fdb0b4899285d73d0f0a2b9ad18062a062c01c8bdb2f720a1535c6ae0978962d24d95b8e2ec9a4a36f23ab6d31d9e7960714ed92996a77fe'
  const certificateTypeID = 'jVNgF8+rifnz00856b4TkThCAvfiUE4p+t/aHYl1u0c='

  //const [serverURL, setServerURL] = useState('http://localhost:8081')
  const [serverURL, setServerURL] = useState('http://localhost:8081')
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
      const typesAndFields = {}
      typesAndFields[certificateTypeID] = ['field1']
      let certificates = await getCertificates({
        types: typesAndFields,
        certifiers: [certifierPublicKey]
      })
      if (certificates.length === 0) {
        // Don't have a certificate yet. Request a new one.
        const certificate = await createCertificate({
          certificateType: certificateTypeID,
          fieldObject: { field1: 42 },
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
        <Typography variant='h4'>Authrite Certifier Tutorial UI</Typography>
        <br />
        <br />
      </center>
      {true && (
        <form>
          <Typography variant='h5'>Authrite Certifier URL</Typography>
          <Typography paragraph>
            Enter the URL of the Authrite Certifier server to interact with
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
              Get Certificate
            </Button>
            )}
            <br />
            <br />
            {loading && (
              <div>
                <Typography variant='h4'>Requesting new certificate!</Typography>
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
        Made with <a href='https://projectbabbage.com'>www.ProjectBabbage.com</a>
      </Typography>
    </div>
  )
}
