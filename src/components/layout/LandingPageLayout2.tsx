import { Layout, theme, Typography } from 'antd'
import React from 'react'
import { Image } from 'antd'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

const LandingPageLayout = (props: { children: React.ReactNode }) => {
    const { Header, Content, Footer } = Layout
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const background = `url('https://www.explore.com/img/gallery/the-50-most-incredible-landscapes-in-the-whole-entire-world/intro-1672072042.jpg')`
    return (
        <Layout
            style={{
                backgroundImage: background,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',                
                alignItems: 'center',
            }}
            className={inter.className}
        >
            <Header
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                    height: 'fit-content',
                    background: 'rgb(0 0 0 / 50%)'
                }}
            >
                <Image
                    alt="logo"
                    src='https://images.vexels.com/media/users/3/142789/isolated/preview/2bfb04ad814c4995f0c537c68db5cd0b-logotipo-de-circulo-de-remolinos-multicolor.png'
                    preview={false}
                    height={120}
                    style={{
                        width: 'auto',
                        objectFit: 'cover',
                        display: 'flex',
                    }}
                />
            </Header>
            <Content style={{ padding: '0 48px', margin: '32px 0' }}>
                <div
                    style={{
                        minHeight: 280,
                        minWidth: 300,
                        maxWidth: 450,
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {props.children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center', width: '100%', background: 'rgb(0 0 0 / 50%)' }}>
                <Typography.Text style={{ color: '#fff' }}>
                    Investors Trust. Global expertise commited to your market.
                </Typography.Text>
            </Footer>
        </Layout>
    )
}

export default LandingPageLayout
