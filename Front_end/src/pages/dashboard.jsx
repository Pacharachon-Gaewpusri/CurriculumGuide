import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// const Non_electronics = [
//     {
//         '''''''
//         Item OCLC Number_,Title,Author Name,LHR Item Call Number,Conspectus Subject,Publisher Name,Publication Date,Circulation Activity Count,URL 
//         959599811,การรักษาแผลกดทับสำหรับพยาบาล /,ขวัญฤทัย พันธุ,616.545 ข275ก 2559, Decubitus Ulcer and Other Skin Ulcers,"สำนักพิมพ์แห่งจุฬาลงกรณ์มหาวิทยาลัย,",2016,0,https://libswu.on.worldcat.org/oclc/959599811 
//         49943028,Disorders of hair growth :diagnosis and treatment' /,"Olsen, Elise A.",WR 450 Di612 2003, Dermatologic Diseases,"McGraw-Hill, Medical Pub. Division,",2003,0,https://libswu.on.worldcat.org/oclc/49943028 
//         963773087,Fisher’s contact dermatitis. /,"Fisher, Alexander A.,; Rietschel, Robert L.Fowler, Joseph F.",WR 175 Fi537 2001, Dermatologic Diseases,"Lippincott, Williams & Wilkins,",2001,0,https://libswu.on.worldcat.org/oclc/963773087 
//         26022398,Dermatology :a scope publication /,"Bluefarb, Samuel M.",616.5 Bl658D, Dermatology,"Upjohn Co.,",1984,0,https://libswu.on.worldcat.org/oclc/26022398
//         43854193,Dermatology secrets in color /,"Fitzpatrick, James E.,Aeling, John L.,",WR 18.2 De435 2001, Dermatology,"Hanley & Belfus,",2001,0,https://libswu.on.worldcat.org/oclc/43854193 
//         47522468,Cosmetic dermatology :principles and practice /,"Baumann, Leslie.",WR 650 Ba347C 2002, Dermatology,"McGraw-Hill, Medical Pub. Div.,",2002,0,https://libswu.on.worldcat.org/oclc/47522468 
//         49526920,Fitzpatrick’s dermatology in general medicine. /,"Fitzpatrick, Thomas B.Freedberg, Irwin M.",WR 140 Fi559 2003, Dermatology,"McGraw-Hill, Medical Pub. Division,",2003,0,https://libswu.on.worldcat.org/oclc/49526920 
//         50285301,Goodheart’s photoguide of common skin disorders :diagnosis and management' /,"Goodheart, Herbert P.; Goodheart, Herbert P.",WR 17 Go652G 2003, Dermatology,"Lippincott Williams & Wilkins,",2003,0,https://libswu.on.worldcat.org/oclc/50285301 
//         55097298,Rook’s textbook of dermatology. /,"Rook, Arthur.Burns, Tony,",WR 140 Ro777 2004, Dermatology,"Blackwell Science,",2004,0,https://libswu.on.worldcat.org/oclc/55097298 
//         57355270,Fifty cases in dermatological medicine /,"Creamer, Daniel.; Du Vivier, Anthony.",WR 140 Fi469 2005, Dermatology,"Taylor & Francis,",2005,0,https://libswu.on.worldcat.org/oclc/57355270 
//         59280346,Practical dermatopathology /,"Rapini, Ronald P.; Rapini, Ronald P.",WR 105 Ra218P 2005, Dermatology,"Elsevier Mosby,",2005,0,https://libswu.on.worldcat.org/oclc/59280346 
//         62736861,Andrews’ diseases of the skin :clinical dermatology.,"James, William D.; Berger, Timothy G.Elston, Dirk M.Odom, Richard B.,",WR140 Ja29A 2006, Dermatology,"Saunders Elsevier,",2006,0,https://libswu.on.worldcat.org/oclc/62736861 
//         71790057,Manual of dermatologic therapeutics /,"Arndt, Kenneth A.,; Hsu, Jeffrey T. S.",WR 39 Ar747M 2007, Dermatology,"Lippincott Williams & Wilkins,",2007,0,https://libswu.on.worldcat.org/oclc/71790057 
//         71790057,Manual of dermatologic therapeutics /,"Arndt, Kenneth A.,; Hsu, Jeffrey T. S.",WR 39 Ar747M 2007  c.2, Dermatology,"Lippincott Williams & Wilkins,",2007,0,https://libswu.on.worldcat.org/oclc/71790057 
//         81942443,Dermatology :an illustrated colour text /,"Gawkrodger, D. J.",WR 140 Ga284D 2008, Dermatology,"Churchill Livingstone Elsevier,",2008,0,https://libswu.on.worldcat.org/oclc/81942443 
//         81942443,Dermatology :an illustrated colour text /,"Gawkrodger, D. J.",WR 140 Ga284D 2008  c.2, Dermatology,"Churchill Livingstone Elsevier,",2008,0,https://libswu.on.worldcat.org/oclc/81942443 
//         81942443,Dermatology :an illustrated colour text /,"Gawkrodger, D. J.",WR 140 Ga284D 2008  c.3, Dermatology,"Churchill Livingstone Elsevier,",2008,0,https://libswu.on.worldcat.org/oclc/81942443 
//         81942443,Dermatology :an illustrated colour text /,"Gawkrodger, D. J.",WR 140 Ga284D 2008  c.4, Dermatology,"Churchill Livingstone Elsevier,",2008,0,https://libswu.on.worldcat.org/oclc/81942443 
//         212399895,Dermatology /,"Bolognia, Jean.Jorizzo, Joseph L.Rapini, Ronald P.",WR 140 De435(2) 2008, Dermatology,"Mosby/Elsevier,",2008,0,https://libswu.on.worldcat.org/oclc/212399895 
//         1392274374,Primer of dermatopathology.,"Hood, Antoinette F.; Kwan, Theodore H.Mihm, Martin C.",WR 140 Pr953 2002, Dermatology,"Lippincott Williams and Wilkins,",2002,0,https://libswu.on.worldcat.org/oclc/1392274374 
//         1519969175,ผิวสวยหน้าใส--(ไม่เคมี) กับมะเขือเทศ /,วิโรจน์ ไววานิชกิจ.,615.323952 ว711ผ, Dermatology,"ธิงค์บียอนด์บุ๊คส์,",2554,0,https://libswu.on.worldcat.org/oclc/1519969175 
//         42256134,Illustrated cutaneous & aesthetic laser surgery /,"Dover, Jeffrey S.Dover, Jeffrey S.",WO511 Il29 2000," Dermatology - Examination, Diagnosis & Therapeutic","Appleton & Lange,",2000,0,https://libswu.on.worldcat.org/oclc/42256134 
//         60740912,Differential diagnosis in dermatology /,"Elewski, Boni E.; Hughey, Lauren C.Parsons, Margaret E.",616.5075 El39D," Dermatology - Examination, Diagnosis & Therapeutic","Elsevier Mosby,",2005,0,https://libswu.on.worldcat.org/oclc/60740912 
//         811850393,Lasers and related technologies in dermatology /,"Geronemus, Roy.",WO 511 La343 2013," Dermatology - Examination, Diagnosis & Therapeutic","McGraw-Hill Education,",2013,0,https://libswu.on.worldcat.org/oclc/811850393 
//         187304683,Alternaria :an identification manual : fully illustrated and with catalogue raisonné 1796-2007 /,"Simmons, Emory G.",QW180.5.D3 Si592A 2007, Dermatophytes,"CBS Fungal Biodiversity Centre,",2007,0,https://libswu.on.worldcat.org/oclc/187304683 
//         36848139,Applied epidemiology :theory to practice /,"Brownson, Ross C.Petitti, Diana B.",614.4072 Ap652, Epidemiology,"Oxford University Press,",1998,0,https://libswu.on.worldcat.org/oclc/36848139 
//         37180378,Critical appraisal of epidemiological studies and clinical trials /,"Elwood, J. Mark.; Elwood, J. Mark.",614.4028 El52C, Epidemiology,"Oxford University Press,",1998,0,https://libswu.on.worldcat.org/oclc/37180378 
//         37966405,Statistics in public health :quantitative approaches to public health problems /,"Stroup, Donna F.,; Teutsch, Steven M.",614.40727 St925S, Epidemiology,"Oxford University Press,",1998,0,https://libswu.on.worldcat.org/oclc/37966405 
//         40872203,Male Call 96 :national telephone survey of men who have sex with men /,"Crawford, June.Kippax, Susan.Van de Ven, Paul.; National Centre in HIV Social Research (Australia)",362.1969792 Ma245, Epidemiology,"National Centre in HIV Social Research,",1998,0,https://libswu.on.worldcat.org/oclc/40872203 
//         49351700,An introduction to epidemiology /,"Timmreck, Thomas C.",WA 950 Ti584I 2002, Epidemiology,"Jones and Bartlett Publishers,",2002,0,https://libswu.on.worldcat.org/oclc/49351700 
//         52418418,Epidemiology /,"Gordis, Leon,",WA 105 Go661E 2004, Epidemiology,"Saunders,",2004,0,https://libswu.on.worldcat.org/oclc/52418418 
//         64442824,Epidemiology :beyond the basics /,"Szklo, M.; Nieto, F. Javier.",WA 950 Sz998E 2007, Epidemiology,"Jones and Bartlett Publishers,",2007,0,https://libswu.on.worldcat.org/oclc/64442824 
//         683019286,ระบาดวิทยาและเวชศาสตร์สาธารณสุข /,"ลอร์เร็นสัน, รอสส์.; มิลเลอร์, เดวิด.; อมรรัตน์ รัตนสิริ,",614.4 ฟ351ร, Epidemiology,"แมคกรอฮิล,",1998,0,https://libswu.on.worldcat.org/oclc/683019286 
//         683171601,State of the art of HIV/AIDS surveillance and its status in Thailand /,"คำนวณ อึ้งชูศักดิ์,; กรมควบคุมโรค.; คณะทำงานวิเคราะห์สถานการณ์เอดส์และแบบแผนการระบาดของการติดเชื้อเอ็ชไอวี",339.01 Di617S 1990, Epidemiology,"สำนักระบาดวิทยา กรมควบคุมโรค กระทรวงสาธารณสุข,",2010,0,https://libswu.on.worldcat.org/oclc/683171601 
//         755943283,The proceedings /,South-East Asia Regional Conference on Epidemiology; World Health Organization.,WA105 Wo927S 2011, Epidemiology,"World Health Organization, Regional Office for South-East Asia,",2011,0,https://libswu.on.worldcat.org/oclc/755943283
//         779898892,National sexual behavior survey of Thailand 2006 /,"Aphichat Chamratrithirong,; Sirinan Kittisuksathit.",306.709593 Na277, Epidemiology,"Institute for Population and Social Research, Mahidol University,",2007,0,https://libswu.on.worldcat.org/oclc/779898892
//         958854459,พื้นฐานระบาดวิทยา =Basics of epidemiology /,"คำนวณ อึ้งชูศักดิ์,; สมาคมนักระบาดวิทยาภาคสนาม.",614.4 พ816 2559, Epidemiology,"สมาคมนักระบาดวิทยาภาคสนาม,",2016,0,https://libswu.on.worldcat.org/oclc/958854459
//         1465584725,Spatial epidemiology :methods and applications /,"Elliott, P.",614.42 Sp738, Epidemiology,"Oxford University Press,",2000,0,https://libswu.on.worldcat.org/oclc/1465584725
//         52938152,Cultured human keratinocytes and tissue engineered skin substitutes /,"Horch, R.Munster, Andrew M.,Achauer, Bruce M.",WO 610 Cu968 2001, Skin,"Georg Thieme,",2001,0,https://libswu.on.worldcat.org/oclc/52938152
//         879487165,เวชศาสตร์ผิวพรรณในวัยเด็ก /,มนตรี อุดมเพทายกุล; มหาวิทยาลัยศรีนครินทรวิโรฒ ประสานมิตร.,WS 260 ม153ว 2555, Skin,"ศูนย์ผิวหนัง คณะแพทยศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ ประสานมิตร,",2012,0,https://libswu.on.worldcat.org/oclc/879487165
//         1170309420,Pediatric dermatology /,"Schachner, Lawrence A.Hansen, Ronald C.",WS 260 Pe371 2003, Skin,"Mosby,",2003,0,https://libswu.on.worldcat.org/oclc/1170309420
//         711512,Manual of skin diseases,"Sauer, Gordon C.",616.5 Sa255M, Skin Diseases (General),Lippincott,1966,0,https://libswu.on.worldcat.org/oclc/711512
//         57232454,The Asian skin :a reference colour atlas of dermatology /,"Goh, Chee Leok.Chua, Sze Hon,Ng, See Ket.",WR 17 As832 2005, Skin Diseases (General),"McGraw-Hill,",2005,0,https://libswu.on.worldcat.org/oclc/57232454
//         682989585,โรคผิวหนังในเวชปฏิบัติ /,"คณะประมวลสาส์น.; ประวิตร พิศาลบุตร,; ปรียา กุลละวณิชย์,",616.5 ร924, Skin Diseases (General),"หมอชาวบ้าน,",1994,0,https://libswu.on.worldcat.org/oclc/682989585
//         882279773,ตำราโรคผิวหนังในเวชปฏิบัติปัจจุบัน = Dermatology 2020 /,"ประวิตร พิศาลบุตร,; ปรียา กุลละวณิชย์,",WR 140 ต227 2555, Skin Diseases (General),"โฮลิสติก พับลิชชิ่ง,",2012,0,https://libswu.on.worldcat.org/oclc/882279773
//         882279773,ตำราโรคผิวหนังในเวชปฏิบัติปัจจุบัน = Dermatology 2020 /,"ประวิตร พิศาลบุตร,; ปรียา กุลละวณิชย์,",WR 140 ต227 2555  c.2, Skin Diseases (General),"โฮลิสติก พับลิชชิ่ง,",2012,0,https://libswu.on.worldcat.org/oclc/882279773
//         882282592,หนังนักสืบ :ไขปริศนาโรคผิวหนังที่หายยาก /,หาญ วงศ์ไวศยวรรณ,616.5 ห526ห 2556, Skin Diseases (General),"โครงการจัดพิมพ์คบไฟ,",2013,0,https://libswu.on.worldcat.org/oclc/882282592
//         1001949925,10+ โรคผิวหนังต้องรู้ /,วาสนา วชิรมน.; พูลเกียรติ สุชนวณิช.; มหาวิทยาลัยมหิดล.,WR 140 ส728 2559, Unknown Classification,สาขาวิชาโรคผิวหนัง ภาควิชาอายุรศาสตร์ คณะแพทยศาสตร์ โรงพยาบาลรามาธิบ,2016,2,https://libswu.on.worldcat.org/oclc/1001949925
//         ''''''''
//     }
// ]

const Dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // if (!localStorage.getItem('username')) navigate('/sign-in')
    }, [navigate])

    return (
        <div className='min-h-screen bg-slate-50 px-4 py-6 text-slate-900'>
            <div className='mx-auto max-w-7xl space-y-6'>
                <header className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                    <h1 className='text-3xl font-semibold'>Curriculum Guide</h1>
                    <p className='mt-2 text-slate-600'></p>
                </header>

                <section className='grid gap-4 lg:grid-cols-4'>
                    <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='text-sm font-medium text-slate-500'></div>
                        <div className='mt-4 text-4xl font-bold text-slate-900'></div>
                    </div>

                </section>

                <section className='grid gap-4 lg:grid-cols-2'>
                    <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h2 className='text-xl font-semibold text-slate-900'>Test1</h2>
                        <p className='mt-2 text-slate-600'>Test2</p>
                        {/* <div className='mt-6 space-y-4'>
                            {days.map((day) => (
                                <div key={day} className='rounded-3xl border border-slate-200 bg-slate-50 p-4'>
                                    <div className='text-sm text-slate-500'>วันที่ {day} กรกฎาคม</div>
                                    <div className='mt-2 text-3xl font-bold text-slate-900'>{completeBoothCounts[day] || 0}</div>
                                </div>
                            ))}
                        </div> */}
                    </div>

                    <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h2 className='text-xl font-semibold text-slate-900'>Test3</h2>
                        <div className='mt-4 overflow-x-auto'>
                            <table className='w-full border-collapse text-left text-sm'>
                                <thead>
                                    <tr>
                                        <th className='border-b border-slate-200 px-4 py-3 font-medium text-slate-600'>big brown fox</th>
                                        <th className='border-b border-slate-200 px-4 py-3 font-medium text-slate-600'>jumps over the lazy dog</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {boothRows.length > 0 ? (
                                        boothRows.map(([booth, count]) => (
                                            <tr key={booth} className='odd:bg-slate-50'>
                                                <td className='border-b border-slate-200 px-4 py-3'>{booth}</td>
                                                <td className='border-b border-slate-200 px-4 py-3'>{count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan='2' className='border-b border-slate-200 px-4 py-3 text-slate-500'>ไม่มีข้อมูลบูธ</td>
                                        </tr>
                                    )} */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Dashboard