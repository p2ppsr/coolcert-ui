import React, { useState, FormEvent } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { toast } from 'react-toastify'
import GetCertIcon from '@mui/icons-material/GetApp'
import 'react-toastify/dist/ReactToastify.css'
import { getCertificates, createCertificate } from '@babbage/sdk-ts'

const App: React.FC = () => {
  const [serverURL, setServerURL] = useState<string>('https://staging-coolcert.babbage.systems')
  const [loading, setLoading] = useState<boolean>(false)
  const [certExists, setCertExists] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)
  const [useEnvelope, setUseEnvelope] = useState<boolean>(false)

  const handleReset = () => {
    setLoading(false)
    setCertExists(false)
    setResult(null)
  }

  const handleGetCert = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const typesAndFields: { [key: string]: string[] } = {}
      const certificateType = 'AGfk/WrT1eBDXpz3mcw386Zww2HmqcIn3uY6x4Af1eo='
      typesAndFields[certificateType] = ['cool']

      let certificates = await getCertificates({
        types: typesAndFields,
        certifiers: ['0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8']
      })
      if (certificates.length === 0) {
        const certificate = await createCertificate({
          certificateType: certificateType,
          fieldObject: { cool: 'true' },
          certifierUrl: serverURL,
          certifierPublicKey: '0247431387e513406817e5e8de00901f8572759012f5ed89b33857295bcc2651f8'
        })
        setResult(certificate)
      } else {
        setCertExists(true)
      }
    } catch (e: any) {
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
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant='h4'>CoolCert UI</Typography>
      </Box>
      <form onSubmit={handleGetCert}>
        <Box my={4}>
          <Typography variant='h5'>Server URL</Typography>
          <Typography paragraph>
            Enter the URL of the CoolCert server to interact with
          </Typography>
          <TextField
            fullWidth
            variant='outlined'
            label='Server URL'
            value={serverURL}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setServerURL(e.target.value)}
          />
        </Box>
        <Box my={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useEnvelope}
                onChange={() => setUseEnvelope(!useEnvelope)}
                color='primary'
              />
            }
            label='Use Envelope Format'
          />
        </Box>
        <Box textAlign="center" my={4}>
          {!loading && !result && !certExists && (
            <Button
              type="submit"
              variant='contained'
              color='primary'
              size='large'
              startIcon={<GetCertIcon />}
            >
              Get Cool Certificate
            </Button>
          )}
          {loading && (
            <CircularProgress />
          )}
          {result && (
            <Typography variant='h4'>Success!</Typography>
          )}
          {certExists && (
            <Typography variant='h4'>You already have one!</Typography>
          )}
          {!loading && (result || certExists) && (
            <Box mt={2}>
              <Button
                onClick={handleReset}
                variant='contained'
                color='primary'
                size='large'
              >
                Reset
              </Button>
            </Box>
          )}
        </Box>
      </form>
      <Typography align='center'>
        View the <a href='https://github.com/p2ppsr/coolcert-ui'>GitHub Repo</a> for this site
      </Typography>
      <Typography align='center'>
        Made with <a href='https://projectbabbage.com'>www.ProjectBabbage.com</a> tools :)
      </Typography>
    </Container>
  )
}

export default App
